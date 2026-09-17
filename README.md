# 💈 Брутальная Борода — Telegram Mini App

Telegram Mini App для записи клиентов в барбершоп «Брутальная Борода».

## 🏗 Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Telegram Bot   │────▶│  FastAPI Backend │────▶│  PostgreSQL  │
│  (aiogram 3.x)  │     │  (REST API)      │     │  (SQLAlchemy)│
└─────────────────┘     └────────┬─────────┘     └──────────────┘
                                 │
                        ┌────────▼─────────┐
                        │  React Frontend  │
                        │  (TMA / Vite)    │
                        └──────────────────┘
```

## 📦 Технологический стек

| Слой | Технология | Версия |
|------|-----------|--------|
| Frontend | React + Vite + TypeScript | React 18+ |
| Стили | Tailwind CSS | 4.x |
| Стейт | Zustand | latest |
| HTTP | Axios (mock API) | latest |
| Backend | FastAPI | 0.100+ |
| ORM | SQLAlchemy 2.0 (async) | 2.x |
| Миграции | Alembic | latest |
| БД | PostgreSQL | 15+ |
| Telegram Bot | aiogram | 3.x |
| Валидация TMA | @telegram-apps/init-data-node | latest |

## 🚀 Быстрый старт (Frontend)

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка
npm run build
```

## 🔧 Backend (FastAPI)

### Структура backend/

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings from .env
│   ├── database.py          # SQLAlchemy async engine
│   ├── models/
│   │   ├── __init__.py
│   │   ├── service.py       # Service model
│   │   ├── master.py        # Master model
│   │   └── booking.py       # Booking model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── service.py
│   │   ├── master.py
│   │   └── booking.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── services.py      # GET /api/services
│   │   ├── masters.py       # GET /api/masters
│   │   ├── slots.py         # GET /api/slots
│   │   └── bookings.py      # POST /api/bookings, GET /api/bookings/me
│   ├── services/
│   │   ├── __init__.py
│   │   ├── slot_service.py  # Логика генерации слотов
│   │   └── booking_service.py # Логика бронирования
│   ├── middleware/
│   │   └── telegram_auth.py # Валидация initData
│   └── db/
│       ├── seed.py          # Seed-скрипт
│       └── migrations/      # Alembic
├── alembic.ini
├── .env.example
├── requirements.txt
└── Dockerfile
```

### Модели БД

```python
# Service
class Service(Base):
    __tablename__ = "services"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    price: Mapped[int] = mapped_column(Integer)
    duration_minutes: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text)

# Master
class Master(Base):
    __tablename__ = "masters"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    photo_url: Mapped[str | None] = mapped_column(String(500))
    rating: Mapped[float] = mapped_column(Float, default=0)
    experience_years: Mapped[int] = mapped_column(Integer)
    work_start: Mapped[time] = mapped_column(Time, default=time(10, 0))
    work_end: Mapped[time] = mapped_column(Time, default=time(20, 0))

# Booking
class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[int] = mapped_column(primary_key=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"))
    master_id: Mapped[int] = mapped_column(ForeignKey("masters.id"))
    telegram_user_id: Mapped[int] = mapped_column(BigInteger)
    client_name: Mapped[str] = mapped_column(String(200))
    date: Mapped[date] = mapped_column(Date)
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

### API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/services` | Список всех услуг |
| GET | `/api/masters` | Список всех мастеров |
| GET | `/api/slots?master_id=X&service_id=Y&date=YYYY-MM-DD` | Свободные слоты |
| POST | `/api/bookings` | Создать запись |
| GET | `/api/bookings/me?telegram_user_id=X` | Мои записи |
| GET | `/api/health` | Проверка работоспособности |

### Логика генерации слотов

```python
async def get_available_slots(master_id: int, service_id: int, date: date, db: AsyncSession):
    master = await db.get(Master, master_id)
    service = await db.get(Service, service_id)
    
    # 1. Генерируем все возможные слоты (30 мин)
    all_slots = generate_time_slots(master.work_start, master.work_end)
    
    # 2. Получаем занятые слоты
    bookings = await db.execute(
        select(Booking).where(
            Booking.master_id == master_id,
            Booking.date == date,
            Booking.status.in_(["pending", "confirmed"])
        )
    )
    occupied = set()
    for booking in bookings.scalars():
        # Занимаем слоты от start_time до end_time
        for slot in all_slots:
            if booking.start_time <= slot < booking.end_time:
                occupied.add(slot)
    
    # 3. Проверяем, что услуга помещается
    slots_needed = ceil(service.duration_minutes / 30)
    available = []
    for i, slot in enumerate(all_slots):
        can_fit = True
        for j in range(slots_needed):
            if i + j >= len(all_slots) or all_slots[i + j] in occupied:
                can_fit = False
                break
        available.append({"time": slot, "available": can_fit})
    
    return available
```

### Защита от race condition

```python
async def create_booking(data: BookingCreate, db: AsyncSession):
    async with db.begin():
        # SELECT FOR UPDATE — блокируем строки
        result = await db.execute(
            select(Booking).where(
                Booking.master_id == data.master_id,
                Booking.date == data.date,
                Booking.status.in_(["pending", "confirmed"])
            ).with_for_update()
        )
        existing = result.scalars().all()
        
        # Проверяем пересечения
        new_start = datetime.strptime(data.time, "%H:%M").time()
        new_end = add_minutes(new_start, service.duration_minutes)
        
        for booking in existing:
            if times_overlap(new_start, new_end, booking.start_time, booking.end_time):
                raise HTTPException(409, "Slot already booked")
        
        # Создаём запись
        booking = Booking(...)
        db.add(booking)
        await db.flush()
        return booking
```

### Валидация Telegram initData

```python
from telegram_app import validate_init_data

async def verify_telegram_user(request: Request):
    init_data = request.headers.get("X-Telegram-Init-Data")
    if not init_data:
        raise HTTPException(401, "Missing init data")
    
    try:
        parsed = validate_init_data(init_data, BOT_TOKEN)
        return parsed["user"]
    except Exception:
        raise HTTPException(401, "Invalid init data")
```

## 🤖 Telegram Bot

```python
# bot/main.py
from aiogram import Bot, Dispatcher, Router
from aiogram.filters import Command
from aiogram.types import Message, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

router = Router()

@router.message(Command("start"))
async def cmd_start(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(
        text="📅 Записаться",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    await message.answer(
        "💈 Добро пожаловать в «Брутальная Борода»!\n\n"
        "Записывайтесь к нашим мастерам прямо здесь.",
        reply_markup=builder.as_markup()
    )

@router.message(Command("my_bookings"))
async def cmd_bookings(message: Message):
    # Получаем записи пользователя из API
    ...
```

## 🐳 Docker

### docker-compose.yml

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: barber_db
      POSTGRES_USER: barber
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://barber:secret@postgres:5432/barber_db
      BOT_TOKEN: ${BOT_TOKEN}
      WEBAPP_URL: ${WEBAPP_URL}
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  bot:
    build: ./bot
    environment:
      BOT_TOKEN: ${BOT_TOKEN}
      API_URL: http://backend:8000
    depends_on:
      - backend

volumes:
  pgdata:
```

## 📱 Экраны Mini App

1. **Выбор услуги** (`/`) — карточки услуг с ценами
2. **Выбор мастера** (`/masters`) — список мастеров с рейтингом
3. **Бронирование** (`/booking`) — календарь + временные слоты
4. **Успех** (`/success`) — подтверждение записи

## 🔑 Переменные окружения

```env
# Backend
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/barber_db
BOT_TOKEN=123456:ABC-DEF
WEBAPP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=123456789

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## 📋 Seed данные

```
Услуги:
- Мужская стрижка: 1500₽ / 60 мин
- Моделирование бороды: 800₽ / 30 мин
- Комплекс «Брутальный»: 2000₽ / 90 мин

Мастера:
- Алекс (7 лет опыта, ★4.9)
- Иван (5 лет опыта, ★4.8)
```

## ⚠️ Важные нюансы

- **initData валидация** — обязательна для безопасности
- **Race condition** — используйте `SELECT FOR UPDATE`
- **Часовые зоны** — храните всё в UTC
- **Telegram-тема** — используйте CSS-переменные `--tg-theme-*`
- **HTTPS** — Telegram открывает Mini App только по HTTPS
- **Haptic Feedback** — тактильный отклик при взаимодействии
