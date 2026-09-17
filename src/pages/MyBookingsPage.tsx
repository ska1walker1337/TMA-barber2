import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { api } from '../api/mockApi';
import { getUser } from '../lib/telegram';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    api.getMyBookings(user.id).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Подтверждено</span>;
      case 'pending':
        return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Ожидает</span>;
      case 'cancelled':
        return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Отменено</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-6 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="animate-fade-in flex items-center gap-2 text-gray-400 mb-6 active:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span className="text-sm">Назад</span>
      </button>

      <div className="animate-fade-in mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Мои записи</h2>
        <p className="text-gray-400 text-sm">История ваших посещений</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-barber-card border border-barber-border rounded-2xl p-5 animate-pulse">
              <div className="h-5 bg-barber-darker rounded w-1/3 mb-2" />
              <div className="h-4 bg-barber-darker rounded w-2/3 mb-2" />
              <div className="h-4 bg-barber-darker rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="animate-fade-in text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-white mb-2">Записей пока нет</h3>
          <p className="text-gray-400 text-sm mb-6">Запишитесь к нашим мастерам прямо сейчас!</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-barber-gold text-white font-medium active:scale-95 transition-transform"
          >
            Записаться
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, index) => (
            <div
              key={booking.id}
              className="animate-fade-in bg-barber-card border border-barber-border rounded-2xl p-5"
              style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{booking.service.icon}</span>
                  <span className="text-white font-medium">{booking.service.name}</span>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{format(new Date(booking.date), 'd MMM', { locale: ru })}</span>
                <span>в {booking.time}</span>
                <span>•</span>
                <span>{booking.master.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
