import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, showBack = true }) => {
  return (
    <div className="animate-fade-in mb-6">
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 mb-4 active:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-sm">Назад</span>
        </button>
      )}
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
    </div>
  );
};
