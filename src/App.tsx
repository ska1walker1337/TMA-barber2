import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    } catch (e) {
      console.log('TG init error:', e);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#c9a96e'
      }}>
        💈 Брутальная Борода
      </h1>
      <p style={{ color: '#999', marginBottom: '24px' }}>
        Барбершоп премиум-класса
      </p>

      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
        Наши услуги
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ServiceCard icon="✂️" name="Мужская стрижка" price="1500 ₽" duration="60 мин" />
        <ServiceCard icon="🪒" name="Моделирование бороды" price="800 ₽" duration="30 мин" />
        <ServiceCard icon="👑" name="Комплекс Брутальный" price="2000 ₽" duration="90 мин" />
      </div>

      <button
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '32px',
          backgroundColor: '#c9a96e',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onClick={() => {
          try {
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
          } catch(e) {}
          alert('Запись пока в разработке!');
        }}
      >
        ЗАПИСАТЬСЯ
      </button>
    </div>
  );
}

function ServiceCard({ icon, name, price, duration }: {
  icon: string;
  name: string;
  price: string;
  duration: string;
}) {
  return (
    <div style={{
      backgroundColor: '#242424',
      border: '1px solid #333',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <span style={{ fontSize: '32px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{name}</div>
        <div style={{ fontSize: '14px', color: '#999' }}>{duration}</div>
      </div>
      <div style={{ color: '#c9a96e', fontWeight: 'bold' }}>{price}</div>
    </div>
  );
}

export default App;