import React from 'react';
import { Master } from '../types';
import { hapticFeedback } from '../lib/telegram';

interface MasterCardProps {
  master: Master;
  onSelect: (master: Master) => void;
  index: number;
}

export const MasterCard: React.FC<MasterCardProps> = ({ master, onSelect, index }) => {
  const handleClick = () => {
    hapticFeedback.medium();
    onSelect(master);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      onClick={handleClick}
      className="animate-fade-in bg-barber-card border border-barber-border rounded-2xl p-5 active:scale-[0.98] transition-all duration-200 cursor-pointer hover:border-barber-gold/50"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-barber-gold to-amber-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {getInitials(master.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{master.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm text-gray-300">{master.rating}</span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-sm text-gray-400">{master.experience_years} лет опыта</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {master.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-xs bg-barber-darker text-gray-300 px-2 py-0.5 rounded-full"
              >
                {spec}
              </span>
            ))}
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
