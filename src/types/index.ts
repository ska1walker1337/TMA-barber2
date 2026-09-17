export interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  description: string;
  icon: string;
}

export interface Master {
  id: number;
  name: string;
  photo_url: string;
  rating: number;
  experience_years: number;
  specialties: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: number;
  service: Service;
  master: Master;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  telegram_user_id: number;
  client_name: string;
}

export interface BookingCreate {
  service_id: number;
  master_id: number;
  date: string;
  time: string;
  telegram_user_id: number;
  client_name: string;
}
