import React, { useState, useEffect } from 'react';
import { hapticFeedback } from '../lib/telegram';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceIcon: string;
  serviceName: string;
  masterName: string;
  date: string;
  time: string;
  price: number;
  duration: number;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceIcon,
  serviceName,
  masterName,
  date,
  time,
  price,
  duration,
  loading = false,
}) => {
  const [agreed, setAgreed] = useState(false);

  // Reset agreement when modal opens
  useEffect(() => {
    if (isOpen) {
      setAgreed(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAgree = () => {
    hapticFeedback.selection();
    setAgreed(!agreed);
  };

  const handleConfirm = () => {
    if (!agreed || loading) return;
    hapticFeedback.medium();
    onConfirm();
  };

  const handleClose = () => {
    if (loading) return;
    hapticFeedback.light();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[480px] bg-barber-card border-t border-barber-border rounded-t-3xl p-6 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-barber-border" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-barber-gold/20 flex items-center justify-center text-2xl">
            {serviceIcon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Подтверждение записи</h3>
            <p className="text-xs text-gray-400">Проверьте детали и подтвердите</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-barber-darker rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Услуга</span>
            <span className="text-sm text-white font-medium">{serviceName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Мастер</span>
            <span className="text-sm text-white font-medium">{masterName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Дата и время</span>
            <span className="text-sm text-white font-medium">{date} в {time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Длительность</span>
            <span className="text-sm text-white font-medium">{duration} мин</span>
          </div>
          <div className="border-t border-barber-border pt-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">Стоимость</span>
            <span className="text-barber-gold font-bold text-lg">{price.toLocaleString()} ₽</span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-5 flex gap-3">
          <div className="flex-shrink-0 text-yellow-400 text-lg">⚠️</div>
          <p className="text-xs text-yellow-200/90 leading-relaxed">
            Отказаться от услуги или отменить запись можно <span className="font-semibold text-yellow-300">не менее чем за 24 часа</span> до выбранного времени. В противном случае запись считается состоявшейся.
          </p>
        </div>

        {/* Agreement Checkbox */}
        <button
          onClick={handleToggleAgree}
          className="w-full flex items-start gap-3 mb-6 text-left active:opacity-80 transition-opacity"
        >
          <div
            className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
              agreed
                ? 'bg-barber-gold border-barber-gold'
                : 'bg-transparent border-gray-500'
            }`}
          >
            {agreed && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-300 leading-snug">
            Я ознакомлен(а) с условиями отмены и подтверждаю запись
          </span>
        </button>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            disabled={!agreed || loading}
            className={`w-full py-3.5 rounded-xl font-medium text-base transition-all duration-200 active:scale-[0.98] ${
              agreed && !loading
                ? 'bg-barber-gold text-white shadow-lg shadow-barber-gold/20'
                : 'bg-barber-darker text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Оформляем...
              </span>
            ) : (
              'Подтвердить запись'
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-full py-3 rounded-xl text-gray-400 font-medium active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
