import React, { useMemo } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { hapticFeedback } from '../lib/telegram';

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const today = startOfDay(new Date());
  
  // Показываем 14 дней начиная с сегодня
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, []);

  const handleSelect = (day: Date) => {
    if (isBefore(day, today)) return;
    hapticFeedback.selection();
    onSelectDate(format(day, 'yyyy-MM-dd'));
  };

  const getDayName = (day: Date) => {
    return format(day, 'EEE', { locale: ru });
  };

  const isToday = (day: Date) => isSameDay(day, today);

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Выберите дату</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = selectedDate === dateStr;
          const isDayToday = isToday(day);
          
          return (
            <button
              key={dateStr}
              onClick={() => handleSelect(day)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-18 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-barber-gold text-white shadow-lg shadow-barber-gold/20'
                  : 'bg-barber-card border border-barber-border text-gray-300 active:scale-95'
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className={`text-xs uppercase ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {getDayName(day)}
              </span>
              <span className="text-xl font-bold mt-1">
                {format(day, 'd')}
              </span>
              {isDayToday && (
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-barber-gold'}`}>
                  сегодня
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
