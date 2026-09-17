import { create } from 'zustand';
import { Service, Master, Booking } from '../types';

interface BookingStore {
  // Выбранная услуга
  service: Service | null;
  setService: (service: Service) => void;
  
  // Выбранный мастер
  master: Master | null;
  setMaster: (master: Master) => void;
  
  // Выбранная дата
  date: string | null;
  setDate: (date: string) => void;
  
  // Выбранное время
  time: string | null;
  setTime: (time: string | null) => void;
  
  // Последняя созданная запись
  lastBooking: Booking | null;
  setLastBooking: (booking: Booking) => void;
  
  // Сброс
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  service: null,
  setService: (service) => set({ service }),
  
  master: null,
  setMaster: (master) => set({ master }),
  
  date: null,
  setDate: (date) => set({ date }),
  
  time: null,
  setTime: (time: string | null) => set({ time }),
  
  lastBooking: null,
  setLastBooking: (booking) => set({ lastBooking: booking }),
  
  reset: () => set({
    service: null,
    master: null,
    date: null,
    time: null,
    lastBooking: null,
  }),
}));
