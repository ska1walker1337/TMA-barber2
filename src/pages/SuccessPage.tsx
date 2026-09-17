import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import confetti from 'canvas-confetti';
import { useBookingStore } from '../store/bookingStore';
import { closeApp, hapticFeedback } from '../lib/telegram';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { lastBooking, reset } = useBookingStore();

  useEffect(() => {
    if (!lastBooking) {
      navigate('/');
      return;
    }
    hapticFeedback.success();

    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#c9a96e', '#f5d998', '#ffffff'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#c9a96e', '#f5d998', '#ffffff'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [lastBooking, navigate]);

  if (!lastBooking) return null;

  const formattedDate = format(new Date(lastBooking.date), 'd MMMM, EEEE', { locale: ru });

  const handleBackToBot = () => {
    hapticFeedback.medium();
    reset();
    closeApp();
  };

  const handleNewBooking = () => {
    hapticFeedback.medium();
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-12 pb-24 flex flex-col items-center">
      {/* Success Animation */}
      <div className="animate-slide-up mb-8 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-green-400/30 animate-ping" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mt-6 mb-2">Вы записаны!</h1>
        <p className="text-gray-400 text-center text-sm max-w-[250px]">
          Ждём вас в барбершопе «Брутальная Борода»
        </p>
      </div>

      {/* Booking Details */}
      <div className="animate-fade-in w-full max-w-sm bg-barber-card border border-barber-border rounded-2xl p-5 mb-6" style={{ animationDelay: '200ms', opacity: 0 }}>
        <div className="space-y-4">
          {/* Service */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-barber-darker flex items-center justify-center text-xl">
              {lastBooking.service.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Услуга</div>
              <div className="text-white font-medium">{lastBooking.service.name}</div>
            </div>
            <div className="text-xs text-gray-400">{lastBooking.service.duration_minutes} мин</div>
          </div>

          {/* Divider */}
          <div className="border-t border-barber-border" />

          {/* Master */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-barber-gold to-amber-700 flex items-center justify-center text-white font-bold text-sm">
              {lastBooking.master.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Мастер</div>
              <div className="text-white font-medium">{lastBooking.master.name}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-gray-400">{lastBooking.master.rating}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-barber-border" />

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-barber-darker flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Дата и время</div>
              <div className="text-white font-medium">{formattedDate}</div>
            </div>
            <div className="bg-barber-gold/20 text-barber-gold px-2.5 py-1 rounded-lg text-sm font-bold">
              {lastBooking.time}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-barber-border" />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Стоимость</span>
            <span className="text-barber-gold font-bold text-xl">{lastBooking.service.price.toLocaleString()} ₽</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="animate-fade-in w-full max-w-sm mb-6" style={{ animationDelay: '300ms', opacity: 0 }}>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-yellow-400">Ожидает подтверждения от мастера</span>
        </div>
      </div>

      {/* Actions */}
      <div className="animate-fade-in w-full max-w-sm space-y-3" style={{ animationDelay: '400ms', opacity: 0 }}>
        <button
          onClick={handleBackToBot}
          className="w-full py-3.5 rounded-xl bg-barber-gold text-white font-medium active:scale-[0.98] transition-transform shadow-lg shadow-barber-gold/20"
        >
          Вернуться в бот
        </button>
        <button
          onClick={handleNewBooking}
          className="w-full py-3.5 rounded-xl bg-barber-card border border-barber-border text-gray-300 font-medium active:scale-[0.98] transition-transform"
        >
          Записать ещё
        </button>
      </div>
    </div>
  );
};
