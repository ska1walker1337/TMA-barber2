import React from 'react';
import { Service } from '../types';
import { hapticFeedback } from '../lib/telegram';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, index }) => {
  const handleClick = () => {
    hapticFeedback.medium();
    onSelect(service);
  };

  return (
    <div
      onClick={handleClick}
      className="animate-fade-in bg-barber-card border border-barber-border rounded-2xl p-5 active:scale-[0.98] transition-all duration-200 cursor-pointer hover:border-barber-gold/50"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{service.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{service.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-barber-gold font-bold text-lg">{service.price.toLocaleString()} ₽</span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-400 text-sm">{service.duration_minutes} мин</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
