import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeSlot } from '../types';
import { api } from '../api/mockApi';
import { useBookingStore } from '../store/bookingStore';
import { Calendar } from '../components/Calendar';
import { TimeSlots } from '../components/TimeSlots';
import { ConfirmModal } from '../components/ConfirmModal';
import { getUser, hapticFeedback, tg } from '../lib/telegram';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { service, master, date, time, setDate, setTime, setLastBooking } = useBookingStore();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no service/master selected
  useEffect(() => {
    if (!service || !master) {
      navigate('/');
    }
  }, [service, master, navigate]);

  // Hide Telegram MainButton (we use custom one)
  useEffect(() => {
    tg?.MainButton?.hide();
    return () => {
      tg?.MainButton?.hide();
    };
  }, []);

  // Load slots when date changes
  useEffect(() => {
    if (date && master && service) {
      setLoadingSlots(true);
      setTime(null);
      api.getSlots(master.id, service.id, date).then((data) => {
        setSlots(data);
        setLoadingSlots(false);
      });
    }
  }, [date, master, service, setTime]);

  const handleBookingClick = () => {
    if (!time || !service || !master) return;
    hapticFeedback.medium();
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!service || !master || !date || !time || submitting) return;
    
    setSubmitting(true);

    try {
      const user = getUser();
      const booking = await api.createBooking({
        service_id: service.id,
        master_id: master.id,
        date,
        time,
        telegram_user_id: user.id,
        client_name: `${user.first_name} ${user.last_name || ''}`.trim(),
      });

      setLastBooking(booking);
      hapticFeedback.success();
      setIsModalOpen(false);
      navigate('/success');
    } catch (error) {
      hapticFeedback.error();
      setSubmitting(false);
    }
  };

  if (!service || !master) return null;

  const formattedDate = date ? format(new Date(date), 'd MMMM, EEEE', { locale: ru }) : '';
  const isButtonActive = !!time;

  // Progress steps
  const steps = [
    { label: 'Услуга', done: true },
    { label: 'Мастер', done: true },
    { label: 'Дата и время', done: false, active: true },
  ];

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-6 pb-32">
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

      {/* Summary Card */}
      <div className="animate-fade-in bg-barber-card border border-barber-border rounded-2xl p-4 mb-6" style={{ animationDelay: '50ms', opacity: 0 }}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{service.icon}</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{service.name}</div>
            <div className="text-xs text-gray-400">
              с {master.name} • {service.duration_minutes} мин • {service.price.toLocaleString()} ₽
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-barber-gold to-amber-700 flex items-center justify-center text-white text-sm font-bold">
            {master.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <Calendar selectedDate={date} onSelectDate={setDate} />
      </div>

      {/* Time Slots */}
      {date && (
        <div className="mb-6">
          <TimeSlots
            slots={slots}
            selectedTime={time}
            onSelectTime={setTime}
            loading={loadingSlots}
          />
        </div>
      )}

      {/* Selected Summary */}
      {date && time && (
        <div className="animate-slide-up bg-barber-gold/10 border border-barber-gold/30 rounded-2xl p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-barber-gold/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div className="text-sm text-white font-medium">{formattedDate}</div>
              <div className="text-xs text-barber-gold">в {time} • {master.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {!date && (
        <div className="animate-fade-in text-center py-8" style={{ animationDelay: '200ms', opacity: 0 }}>
          <div className="text-3xl mb-2">📅</div>
          <p className="text-gray-400 text-sm">Выберите дату для просмотра свободных слотов</p>
        </div>
      )}

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-[480px] mx-auto pointer-events-auto">
          <div
            className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom, 0px) + 12px)]"
            style={{
              background: 'linear-gradient(to top, var(--tg-theme-bg-color, #1a1a1a) 70%, transparent 100%)',
            }}
          >
            <button
              onClick={handleBookingClick}
              disabled={!isButtonActive}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                isButtonActive
                  ? 'bg-barber-gold text-white shadow-lg shadow-barber-gold/30 active:scale-[0.98]'
                  : 'bg-barber-card text-gray-500 border border-barber-border cursor-not-allowed'
              }`}
            >
              {time ? (
                <span className="flex items-center justify-center gap-2">
                  <span>ЗАПИСАТЬСЯ</span>
                  <span className="text-white/80 font-medium">на {time}</span>
                </span>
              ) : (
                'Выберите время'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        serviceIcon={service.icon}
        serviceName={service.name}
        masterName={master.name}
        date={formattedDate}
        time={time || ''}
        price={service.price}
        duration={service.duration_minutes}
        loading={submitting}
      />
    </div>
  );
};
