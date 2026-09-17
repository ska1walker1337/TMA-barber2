import React from 'react';
import { TimeSlot } from '../types';
import { hapticFeedback } from '../lib/telegram';

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  loading: boolean;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({ slots, selectedTime, onSelectTime, loading }) => {
  const handleClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    hapticFeedback.selection();
    onSelectTime(slot.time);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Загрузка слотов...</h3>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-11 bg-barber-card rounded-xl animate-pulse border border-barber-border"
            />
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="animate-fade-in text-center py-8">
        <p className="text-gray-400">Выберите дату для просмотра слотов</p>
      </div>
    );
  }

  const availableCount = slots.filter(s => s.available).length;
  
  if (availableCount === 0) {
    return (
      <div className="animate-fade-in text-center py-8">
        <p className="text-gray-400">😔 На эту дату нет свободных слотов</p>
        <p className="text-gray-500 text-sm mt-1">Попробуйте другой день</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Выберите время</h3>
        <span className="text-xs text-gray-500">{availableCount} свободно</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          
          return (
            <button
              key={slot.time}
              onClick={() => handleClick(slot)}
              disabled={!slot.available}
              className={`h-11 rounded-xl text-sm font-medium transition-all duration-200 ${
                !slot.available
                  ? 'bg-barber-darker text-gray-600 cursor-not-allowed border border-transparent'
                  : isSelected
                  ? 'bg-barber-gold text-white shadow-lg shadow-barber-gold/20 scale-105'
                  : 'bg-barber-card text-gray-200 border border-barber-border active:scale-95 hover:border-barber-gold/30'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
