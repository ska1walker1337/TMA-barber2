import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Master } from '../types';
import { api } from '../api/mockApi';
import { useBookingStore } from '../store/bookingStore';
import { MasterCard } from '../components/MasterCard';

export const MasterSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { service, setMaster } = useBookingStore();
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!service) {
      navigate('/');
      return;
    }
    api.getMasters().then((data) => {
      setMasters(data);
      setLoading(false);
    });
  }, [service, navigate]);

  const handleSelect = (master: Master) => {
    setMaster(master);
    navigate('/booking');
  };

  // Progress steps
  const steps = [
    { label: 'Услуга', done: true },
    { label: 'Мастер', done: false, active: true },
    { label: 'Дата и время', done: false },
  ];

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-6 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="animate-fade-in flex items-center gap-2 text-gray-400 mb-4 active:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span className="text-sm">Назад</span>
      </button>

      {/* Progress Steps */}
      <div className="animate-fade-in flex items-center gap-2 mb-6">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step.done 
                  ? 'bg-barber-gold text-white' 
                  : step.active 
                  ? 'bg-barber-gold/20 text-barber-gold border border-barber-gold' 
                  : 'bg-barber-card text-gray-500 border border-barber-border'
              }`}>
                {step.done ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${step.active ? 'text-white' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${step.done ? 'bg-barber-gold' : 'bg-barber-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Selected Service Badge */}
      {service && (
        <div className="animate-fade-in mb-4" style={{ animationDelay: '50ms', opacity: 0 }}>
          <div className="inline-flex items-center gap-2 bg-barber-card border border-barber-border rounded-full px-4 py-2">
            <span className="text-lg">{service.icon}</span>
            <span className="text-sm text-gray-300">{service.name}</span>
            <span className="text-barber-gold text-sm font-medium">{service.price.toLocaleString()} ₽</span>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="animate-fade-in mb-6" style={{ animationDelay: '100ms', opacity: 0 }}>
        <h2 className="text-2xl font-bold text-white mb-1">Выберите мастера</h2>
        <p className="text-gray-400 text-sm">Кто будет вас стричь?</p>
      </div>

      {/* Masters List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-barber-card border border-barber-border rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-barber-darker" />
                <div className="flex-1">
                  <div className="h-5 bg-barber-darker rounded w-1/2 mb-2" />
                  <div className="h-4 bg-barber-darker rounded w-2/3 mb-2" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-barber-darker rounded-full w-16" />
                    <div className="h-5 bg-barber-darker rounded-full w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {masters.map((master, index) => (
            <MasterCard
              key={master.id}
              master={master}
              onSelect={handleSelect}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};
