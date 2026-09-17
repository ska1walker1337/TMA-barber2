import React from 'react';

interface LoadingDotsProps {
  text?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ text = 'Загрузка' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-barber-gold animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-barber-gold animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-barber-gold animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-sm text-gray-400">{text}...</p>
    </div>
  );
};
