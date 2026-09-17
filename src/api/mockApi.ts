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

// Мок-записи (имитация занятых слотов)
const mockBookings: { master_id: number; date: string; time: string }[] = [
  { master_id: 1, date: new Date().toISOString().split('T')[0], time: '10:00' },
  { master_id: 1, date: new Date().toISOString().split('T')[0], time: '10:30' },
  { master_id: 1, date: new Date().toISOString().split('T')[0], time: '14:00' },
  { master_id: 2, date: new Date().toISOString().split('T')[0], time: '11:00' },
  { master_id: 2, date: new Date().toISOString().split('T')[0], time: '11:30' },
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

    const slots: TimeSlot[] = [];
    const workStart = 10; // 10:00
    const workEnd = 20; // 20:00
    const slotsNeeded = Math.ceil(service.duration_minutes / 30);

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        
        // Проверяем, достаточно ли слотов для услуги
        let canFit = true;
        for (let i = 0; i < slotsNeeded; i++) {
          const slotHour = hour + Math.floor((min + i * 30) / 60);
          const slotMin = (min + i * 30) % 60;
          if (slotHour >= workEnd) {
            canFit = false;
            break;
          }
          const slotTime = `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}`;
          const isBooked = mockBookings.some(
            b => b.master_id === masterId && b.date === date && b.time === slotTime
          );
          if (isBooked) {
            canFit = false;
            break;
          }
        }

        slots.push({ time, available: canFit });
      }
    }

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
