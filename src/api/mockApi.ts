import { Service, Master, TimeSlot, Booking } from '../types';

// Мок-данные
const services: Service[] = [
  {
    id: 1,
    name: 'Мужская стрижка',
    price: 1500,
    duration_minutes: 60,
    description: 'Классическая или модельная стрижка с укладкой',
    icon: '✂️',
  },
  {
    id: 2,
    name: 'Моделирование бороды',
    price: 800,
    duration_minutes: 30,
    description: 'Стрижка и оформление бороды, опасная бритва',
    icon: '🪒',
  },
  {
    id: 3,
    name: 'Комплекс «Брутальный»',
    price: 2000,
    duration_minutes: 90,
    description: 'Стрижка + борода + уход + укладка',
    icon: '👑',
  },
];

const masters: Master[] = [
  {
    id: 1,
    name: 'Алекс',
    photo_url: '',
    rating: 4.9,
    experience_years: 7,
    specialties: ['Фейды', 'Классика', 'Бороды'],
  },
  {
    id: 2,
    name: 'Иван',
    photo_url: '',
    rating: 4.8,
    experience_years: 5,
    specialties: ['Креативные стрижки', 'Длинные волосы', 'Камуфляж седины'],
  },
];

// Мок-записи (только начальные слоты записей, каждая = 60 мин = 2 слота)
// Логика: запись на 10:00 → занимает 10:00 и 10:30, буфер 11:00, свободно с 11:30
const mockBookings: { master_id: number; date: string; time: string }[] = [
  // Алекс: запись на 10:00 (60мин) → занято 10:00-10:30, буфер 11:00, свободно с 11:30
  { master_id: 1, date: new Date().toISOString().split('T')[0], time: '10:00' },
  // Алекс: запись на 14:00 (60мин) → занято 14:00-14:30, буфер 15:00, свободно с 15:30
  { master_id: 1, date: new Date().toISOString().split('T')[0], time: '14:00' },
  // Иван: запись на 11:00 (60мин) → занято 11:00-11:30, буфер 12:00, свободно с 12:30
  { master_id: 2, date: new Date().toISOString().split('T')[0], time: '11:00' },
  // Иван: запись на 15:00 (60мин) → занято 15:00-15:30, буфер 16:00, свободно с 16:30
  { master_id: 2, date: new Date().toISOString().split('T')[0], time: '15:00' },
];

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getServices(): Promise<Service[]> {
    await delay(300);
    return [...services];
  },

  async getMasters(): Promise<Master[]> {
    await delay(300);
    return [...masters];
  },

  async getSlots(masterId: number, serviceId: number, date: string): Promise<TimeSlot[]> {
    await delay(500);
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return [];

    const workStart = 10; // 10:00
    const workEnd = 20; // 20:00
    const slotsNeeded = Math.ceil(service.duration_minutes / 30);
    const BUFFER_SLOTS = 1; // 1 слот (30 мин) перерыва после каждой записи

    // Генерируем все слоты рабочего дня
    const allTimes: string[] = [];
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let min = 0; min < 60; min += 30) {
        allTimes.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }

    // Получаем записи мастера на эту дату
    const dayBookings = mockBookings.filter(
      b => b.master_id === masterId && b.date === date
    );

    // Строим множество занятых слотов (записи + буферные перерывы)
    const occupiedSet = new Set<string>();

    for (const booking of dayBookings) {
      // Находим услугу этой записи (по умолчанию считаем что это стрижка 60мин = 2 слота)
      // Для мок-данных: каждая запись занимает 2 слота (60 мин)
      const bookingDurationSlots = 2;
      const bookingIdx = allTimes.indexOf(booking.time);
      
      if (bookingIdx === -1) continue;

      // Занимаем слоты самой записи
      for (let i = 0; i < bookingDurationSlots; i++) {
        if (bookingIdx + i < allTimes.length) {
          occupiedSet.add(allTimes[bookingIdx + i]);
        }
      }

      // Добавляем буферный слот (перерыв мастера) после записи
      const bufferStart = bookingIdx + bookingDurationSlots;
      for (let i = 0; i < BUFFER_SLOTS; i++) {
        if (bufferStart + i < allTimes.length) {
          occupiedSet.add(allTimes[bufferStart + i]);
        }
      }
    }

    // Проверяем доступность каждого слота
    const slots: TimeSlot[] = allTimes.map((time) => {
      const startIdx = allTimes.indexOf(time);
      
      // Проверяем, помещается ли услуга начиная с этого слота
      let canFit = true;
      
      // Нужны слоты для услуги + буфер после неё
      const totalNeeded = slotsNeeded + BUFFER_SLOTS;
      
      for (let i = 0; i < totalNeeded; i++) {
        const checkIdx = startIdx + i;
        
        // Если выходим за рабочий день — не помещается
        if (checkIdx >= allTimes.length) {
          canFit = false;
          break;
        }
        
        // Если слот занят (записью или буфером) — не помещается
        if (occupiedSet.has(allTimes[checkIdx])) {
          canFit = false;
          break;
        }
      }

      // Слот НЕ доступен, если он сам занят (но может быть частью буфера)
      const isSelfOccupied = occupiedSet.has(time);

      return { time, available: canFit && !isSelfOccupied };
    });

    return slots;
  },

  async createBooking(data: {
    service_id: number;
    master_id: number;
    date: string;
    time: string;
    telegram_user_id: number;
    client_name: string;
  }): Promise<Booking> {
    await delay(800);
    
    const service = services.find(s => s.id === data.service_id)!;
    const master = masters.find(m => m.id === data.master_id)!;
    
    // Добавляем в мок-записи
    mockBookings.push({
      master_id: data.master_id,
      date: data.date,
      time: data.time,
    });

    return {
      id: Math.floor(Math.random() * 10000),
      service,
      master,
      date: data.date,
      time: data.time,
      status: 'pending',
      telegram_user_id: data.telegram_user_id,
      client_name: data.client_name,
    };
  },

  async getMyBookings(telegramUserId: number): Promise<Booking[]> {
    await delay(300);
    return [];
  },
};
