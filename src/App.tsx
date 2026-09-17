import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ServiceSelectPage } from './pages/ServiceSelectPage';
import { MasterSelectPage } from './pages/MasterSelectPage';
import { BookingPage } from './pages/BookingPage';
import { SuccessPage } from './pages/SuccessPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { initTelegram } from './lib/telegram';

function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <HashRouter>
      <div className="max-w-[480px] mx-auto min-h-screen bg-tg-bg">
        <Routes>
          <Route path="/" element={<ServiceSelectPage />} />
          <Route path="/masters" element={<MasterSelectPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
