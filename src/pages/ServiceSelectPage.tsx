import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { api } from '../api/mockApi';
import { useBookingStore } from '../store/bookingStore';
import { ServiceCard } from '../components/ServiceCard';
import { getUser } from '../lib/telegram';

export const ServiceSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { setService, reset } = useBookingStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    // Reset booking state on main page
    reset();
    api.getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, [reset]);

  const handleSelect = (service: Service) => {
    setService(service);
    navigate('/masters');
  };

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-6 pb-24">
      {/* Header */}
      <div className="animate-fade-in mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-barber-gold to-amber-700 flex items-center justify-center shadow-lg shadow-barber-gold/20">
              <span className="text-2xl">💈</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Брутальная Борода</h1>
              <p className="text-xs text-gray-400">Привет, {user.first_name}!</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/my-bookings')}
            className="w-10 h-10 rounded-xl bg-barber-card border border-barber-border flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="animate-fade-in bg-gradient-to-r from-barber-gold/20 to-amber-900/20 border border-barber-gold/30 rounded-2xl p-5 mb-6" style={{ animationDelay: '50ms', opacity: 0 }}>
        <h2 className="text-xl font-bold text-white mb-1">Запись онлайн</h2>
        <p className="text-sm text-gray-300">Выберите услугу, мастера и удобное время</p>
      </div>

      {/* Title */}
      <div className="animate-fade-in mb-5" style={{ animationDelay: '100ms', opacity: 0 }}>
        <h3 className="text-lg font-bold text-white mb-1">Наши услуги</h3>
        <p className="text-gray-400 text-sm">Что будем делать сегодня?</p>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-barber-card border border-barber-border rounded-2xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-barber-darker" />
                <div className="flex-1">
                  <div className="h-5 bg-barber-darker rounded w-3/4 mb-2" />
                  <div className="h-4 bg-barber-darker rounded w-1/2 mb-3" />
                  <div className="h-5 bg-barber-darker rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={handleSelect}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="animate-fade-in mt-8 text-center" style={{ animationDelay: '400ms', opacity: 0 }}>
        <p className="text-xs text-gray-500">
          📍 ул. Барберов, 42 • Ежедневно 10:00–20:00
        </p>
        <p className="text-xs text-gray-600 mt-1">
          📞 +7 (999) 123-45-67
        </p>
      </div>
    </div>
  );
};
