import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const services = [
  { id: 1, icon: '✂️', name: 'Мужская стрижка', price: 1500, duration: 60 },
  { id: 2, icon: '🪒', name: 'Моделирование бороды', price: 800, duration: 30 },
  { id: 3, icon: '👑', name: 'Комплекс Брутальный', price: 2000, duration: 90 },
];

const masters = [
  { id: 1, name: 'Алекс', rating: 4.9, experience: 7, specialties: ['Фейды', 'Классика', 'Бороды'] },
  { id: 2, name: 'Иван', rating: 4.8, experience: 5, specialties: ['Креатив', 'Длинные волосы', 'Камуфляж'] },
];

function App() {
  const [screen, setScreen] = useState<'services' | 'masters' | 'booking'>('services');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedMaster, setSelectedMaster] = useState<any>(null);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    } catch (e) {}
  }, []);

  const goBack = () => {
    if (screen === 'masters') {
      setScreen('services');
      setSelectedService(null);
    } else if (screen === 'booking') {
      setScreen('masters');
      setSelectedMaster(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #c9a96e, #8B6914)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
        }}>💈</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Брутальная Борода</div>
          <div style={{ fontSize: '12px', color: '#999' }}>Барбершоп премиум-класса</div>
        </div>
      </div>

      {/* Back button */}
      {screen !== 'services' && (
        <button
          onClick={goBack}
          style={{
            background: 'none', border: 'none', color: '#999',
            fontSize: '14px', cursor: 'pointer', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          ← Назад
        </button>
      )}

      {/* Screen: Services */}
      {screen === 'services' && (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            Выберите услугу
          </h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
            Что будем делать сегодня?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setScreen('masters');
                  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch(e) {}
                }}
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '32px' }}>{service.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{service.name}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{service.duration} мин</div>
                </div>
                <div style={{ color: '#c9a96e', fontWeight: 'bold' }}>{service.price} ₽</div>
                <div style={{ color: '#666' }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Screen: Masters */}
      {screen === 'masters' && selectedService && (
        <>
          {/* Selected service badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#242424', border: '1px solid #333',
            borderRadius: '20px', padding: '8px 16px', marginBottom: '20px'
          }}>
            <span>{selectedService.icon}</span>
            <span style={{ fontSize: '14px' }}>{selectedService.name}</span>
            <span style={{ color: '#c9a96e', fontWeight: 'bold', fontSize: '14px' }}>{selectedService.price} ₽</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            Выберите мастера
          </h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
            Кто будет вас стричь?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {masters.map((master) => (
              <div
                key={master.id}
                onClick={() => {
                  setSelectedMaster(master);
                  setScreen('booking');
                  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch(e) {}
                }}
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a96e, #8B6914)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', fontWeight: 'bold', flexShrink: 0
                }}>{master.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{master.name}</div>
                  <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>
                    ★ {master.rating} • {master.experience} лет опыта
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {master.specialties.map((spec, i) => (
                      <span key={i} style={{
                        fontSize: '11px', backgroundColor: '#1a1a1a',
                        color: '#ccc', padding: '2px 8px', borderRadius: '10px'
                      }}>{spec}</span>
                    ))}
                  </div>
                </div>
                <div style={{ color: '#666' }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Screen: Booking (placeholder) */}
      {screen === 'booking' && selectedService && selectedMaster && (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            Запись
          </h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
            Выбор даты и времени
          </p>

          <div style={{
            backgroundColor: '#242424', border: '1px solid #333',
            borderRadius: '16px', padding: '16px', marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{selectedService.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{selectedService.name}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>
                  с {selectedMaster.name} • {selectedService.duration} мин
                </div>
              </div>
              <div style={{ color: '#c9a96e', fontWeight: 'bold' }}>{selectedService.price} ₽</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#242424', border: '1px solid #c9a96e',
            borderRadius: '16px', padding: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Скоро здесь будет календарь</div>
            <div style={{ fontSize: '13px', color: '#999' }}>
              Вы выбрали: {selectedService.name} у мастера {selectedMaster.name}
            </div>
          </div>

          <button
            onClick={() => {
              try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'); } catch(e) {}
              alert('Запись подтверждена! (пока в разработке)');
            }}
            style={{
              width: '100%', padding: '16px', marginTop: '24px',
              backgroundColor: '#c9a96e', color: '#ffffff',
              border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            ЗАПИСАТЬСЯ
          </button>
        </>
      )}
    </div>
  );
}

export default App;