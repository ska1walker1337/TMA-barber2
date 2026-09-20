import React, { useEffect, useState, useMemo } from 'react';

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

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const mockBookings = [
  { masterId: 1, date: todayStr, time: '10:00' },
  { masterId: 1, date: todayStr, time: '14:00' },
  { masterId: 2, date: todayStr, time: '11:00' },
  { masterId: 2, date: todayStr, time: '15:00' },
];

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayName(date: Date): string {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}

function getSlotsForDate(masterId: number, serviceDuration: number, date: string) {
  const slotsNeeded = Math.ceil(serviceDuration / 30);
  const bufferSlots = 1;
  const allTimes: string[] = [];
  for (let hour = 10; hour < 20; hour++) {
    for (let min = 0; min < 60; min += 30) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
  }
  const dayBookings = mockBookings.filter(b => b.masterId === masterId && b.date === date);
  const occupied = new Set<string>();
  for (const booking of dayBookings) {
    const idx = allTimes.indexOf(booking.time);
    if (idx === -1) continue;
    for (let i = 0; i < slotsNeeded; i++) {
      if (idx + i < allTimes.length) occupied.add(allTimes[idx + i]);
    }
    for (let i = 0; i < bufferSlots; i++) {
      if (idx + slotsNeeded + i < allTimes.length) occupied.add(allTimes[idx + slotsNeeded + i]);
    }
  }
  return allTimes.map(time => {
    const startIdx = allTimes.indexOf(time);
    let canFit = true;
    const totalNeeded = slotsNeeded + bufferSlots;
    for (let i = 0; i < totalNeeded; i++) {
      const checkIdx = startIdx + i;
      if (checkIdx >= allTimes.length || occupied.has(allTimes[checkIdx])) {
        canFit = false;
        break;
      }
    }
    return { time, available: canFit && !occupied.has(time) };
  });
}

function App() {
  const [screen, setScreen] = useState<'services' | 'masters' | 'booking' | 'success'>('services');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedMaster, setSelectedMaster] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) { tg.ready(); tg.expand(); }
    } catch (e) {}
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const slots = useMemo(() => {
    if (!selectedDate || !selectedMaster || !selectedService) return [];
    return getSlotsForDate(selectedMaster.id, selectedService.duration, selectedDate);
  }, [selectedDate, selectedMaster, selectedService]);

  const goBack = () => {
    if (screen === 'masters') { setScreen('services'); setSelectedService(null); }
    else if (screen === 'booking') { setScreen('masters'); setSelectedMaster(null); setSelectedDate(null); setSelectedTime(null); }
  };

  const handleBookClick = () => {
    if (!selectedTime) return;
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch(e) {}
    setAgreed(false);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'); } catch(e) {}
    setTimeout(() => {
      setSubmitting(false);
      setShowModal(false);
      setScreen('success');
    }, 800);
  };

  const handleNewBooking = () => {
    setScreen('services');
    setSelectedService(null);
    setSelectedMaster(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#ffffff',
      padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      paddingBottom: '100px'
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
      {screen !== 'services' && screen !== 'success' && (
        <button onClick={goBack} style={{
          background: 'none', border: 'none', color: '#999',
          fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: '4px 0'
        }}>← Назад</button>
      )}

      {/* SCREEN: Services */}
      {screen === 'services' && (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Выберите услугу</h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>Что будем делать сегодня?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map((s) => (
              <div key={s.id} onClick={() => { setSelectedService(s); setScreen('masters'); }}
                style={{ backgroundColor: '#242424', border: '1px solid #333', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '32px' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{s.duration} мин</div>
                </div>
                <div style={{ color: '#c9a96e', fontWeight: 'bold' }}>{s.price} ₽</div>
                <div style={{ color: '#666' }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SCREEN: Masters */}
      {screen === 'masters' && selectedService && (
        <>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#242424', border: '1px solid #333',
            borderRadius: '20px', padding: '8px 16px', marginBottom: '20px'
          }}>
            <span>{selectedService.icon}</span>
            <span style={{ fontSize: '14px' }}>{selectedService.name}</span>
            <span style={{ color: '#c9a96e', fontWeight: 'bold', fontSize: '14px' }}>{selectedService.price} ₽</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Выберите мастера</h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>Кто будет вас стричь?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {masters.map((m) => (
              <div key={m.id} onClick={() => { setSelectedMaster(m); setScreen('booking'); }}
                style={{ backgroundColor: '#242424', border: '1px solid #333', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a96e, #8B6914)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', fontWeight: 'bold', flexShrink: 0
                }}>{m.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{m.name}</div>
                  <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>★ {m.rating} • {m.experience} лет опыта</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {m.specialties.map((spec, i) => (
                      <span key={i} style={{ fontSize: '11px', backgroundColor: '#1a1a1a', color: '#ccc', padding: '2px 8px', borderRadius: '10px' }}>{spec}</span>
                    ))}
                  </div>
                </div>
                <div style={{ color: '#666' }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SCREEN: Booking */}
      {screen === 'booking' && selectedService && selectedMaster && (
        <>
          <div style={{
            backgroundColor: '#242424', border: '1px solid #333',
            borderRadius: '16px', padding: '12px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>{selectedService.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedService.name}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>с {selectedMaster.name} • {selectedService.duration} мин</div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a96e, #8B6914)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 'bold'
            }}>{selectedMaster.name[0]}</div>
          </div>

          <h3 style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Выберите дату</h3>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
            {days.map((day) => {
              const dateStr = formatDate(day);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayStr;
              return (
                <button key={dateStr} onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                  style={{
                    flexShrink: 0, width: '56px', padding: '10px 0',
                    borderRadius: '12px', border: isSelected ? 'none' : '1px solid #333',
                    backgroundColor: isSelected ? '#c9a96e' : '#242424',
                    color: isSelected ? '#fff' : '#ccc',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '4px'
                  }}>
                  <span style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.7)' : '#666', textTransform: 'uppercase' }}>{getDayName(day)}</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{day.getDate()}</span>
                  {isToday && <span style={{ fontSize: '9px', color: isSelected ? 'rgba(255,255,255,0.7)' : '#c9a96e' }}>сегодня</span>}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Выберите время</h3>
                <span style={{ fontSize: '12px', color: '#666' }}>{slots.filter(s => s.available).length} свободно</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                      style={{
                        height: '44px', borderRadius: '12px',
                        border: isSelected ? 'none' : slot.available ? '1px solid #333' : '1px solid transparent',
                        backgroundColor: !slot.available ? '#111' : isSelected ? '#c9a96e' : '#242424',
                        color: !slot.available ? '#555' : isSelected ? '#fff' : '#ccc',
                        fontSize: '14px', fontWeight: '500',
                        cursor: slot.available ? 'pointer' : 'not-allowed'
                      }}>
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!selectedDate && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
              <p style={{ color: '#999', fontSize: '14px' }}>Выберите дату для просмотра слотов</p>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div style={{
              backgroundColor: 'rgba(201, 169, 110, 0.1)', border: '1px solid rgba(201, 169, 110, 0.3)',
              borderRadius: '16px', padding: '16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'rgba(201, 169, 110, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>🕐</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedDate}</div>
                <div style={{ fontSize: '12px', color: '#c9a96e' }}>в {selectedTime} • {selectedMaster.name}</div>
              </div>
            </div>
          )}

          <button onClick={handleBookClick} disabled={!selectedTime}
            style={{
              width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
              backgroundColor: selectedTime ? '#c9a96e' : '#333',
              color: selectedTime ? '#fff' : '#666',
              fontSize: '16px', fontWeight: 'bold',
              cursor: selectedTime ? 'pointer' : 'not-allowed',
              boxShadow: selectedTime ? '0 10px 30px rgba(201, 169, 110, 0.3)' : 'none'
            }}>
            {selectedTime ? `ЗАПИСАТЬСЯ на ${selectedTime}` : 'Выберите время'}
          </button>
        </>
      )}

      {/* SCREEN: Success */}
      {screen === 'success' && selectedService && selectedMaster && selectedDate && selectedTime && (
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4ade80, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '36px'
          }}>✓</div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Вы записаны!</h2>
          <p style={{ color: '#999', marginBottom: '32px' }}>Ждём вас в барбершопе</p>

          <div style={{
            backgroundColor: '#242424', border: '1px solid #333',
            borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Услуга</span>
              <span style={{ fontWeight: 'bold' }}>{selectedService.icon} {selectedService.name}</span>
            </div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Мастер</span>
              <span style={{ fontWeight: 'bold' }}>{selectedMaster.name}</span>
            </div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Дата и время</span>
              <span style={{ fontWeight: 'bold' }}>{selectedDate} в {selectedTime}</span>
            </div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#999', fontSize: '14px' }}>Стоимость</span>
              <span style={{ fontWeight: 'bold', color: '#c9a96e', fontSize: '18px' }}>{selectedService.price} ₽</span>
            </div>
          </div>

          <button onClick={handleNewBooking} style={{
            width: '100%', padding: '16px', backgroundColor: '#c9a96e',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}>Записать ещё</button>
        </div>
      )}

      {/* MODAL: Confirmation */}
      {showModal && selectedService && selectedMaster && selectedDate && selectedTime && (
        <div onClick={() => !submitting && setShowModal(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
          }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px',
              backgroundColor: '#242424', borderTop: '1px solid #333',
              borderRadius: '24px 24px 0 0', padding: '24px', paddingBottom: '32px'
            }}>
            {/* Handle */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#444', margin: '0 auto 16px' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: 'rgba(201, 169, 110, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
              }}>{selectedService.icon}</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Подтверждение записи</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Проверьте детали и подтвердите</div>
              </div>
            </div>

            {/* Details */}
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Услуга</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedService.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Мастер</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedMaster.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Дата и время</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedDate} в {selectedTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Длительность</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedService.duration} мин</span>
              </div>
              <div style={{ borderTop: '1px solid #333', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Стоимость</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#c9a96e' }}>{selectedService.price} ₽</span>
              </div>
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)',
              borderRadius: '12px', padding: '12px', marginBottom: '20px',
              display: 'flex', gap: '10px'
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
              <p style={{ fontSize: '12px', color: '#fbbf24', lineHeight: '1.5' }}>
                Отказаться от услуги или отменить запись можно <b style={{ color: '#fcd34d' }}>не менее чем за 24 часа</b> до выбранного времени.
              </p>
            </div>

            {/* Agreement checkbox */}
            <div onClick={() => setAgreed(!agreed)}
              style={{ display: 'flex', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                border: agreed ? '2px solid #c9a96e' : '2px solid #666',
                backgroundColor: agreed ? '#c9a96e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '2px'
              }}>
                {agreed && <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.5' }}>
                Я ознакомлен(а) с условиями отмены и подтверждаю запись
              </span>
            </div>

            {/* Buttons */}
            <button onClick={handleConfirm} disabled={!agreed || submitting}
              style={{
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                backgroundColor: agreed && !submitting ? '#c9a96e' : '#333',
                color: agreed && !submitting ? '#fff' : '#666',
                fontSize: '16px', fontWeight: 'bold',
                cursor: agreed && !submitting ? 'pointer' : 'not-allowed',
                marginBottom: '8px'
              }}>
              {submitting ? 'Оформляем...' : 'Подтвердить запись'}
            </button>
            <button onClick={() => !submitting && setShowModal(false)}
              style={{
                width: '100%', padding: '12px', background: 'none',
                border: 'none', color: '#999', fontSize: '14px', cursor: 'pointer'
              }}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;