declare global {
  interface Window {
    Telegram?: any;
  }
}

export const tg = window.Telegram?.WebApp;

export const initTelegram = () => {
  if (tg) {
    tg.ready();
    tg.expand();
  }
};

export const getUser = () => {
  return tg?.initDataUnsafe?.user || {
    id: 123456789,
    first_name: 'Гость',
    last_name: '',
    username: 'guest',
  };
};

export const hapticFeedback = {
  light: () => { try { tg?.HapticFeedback?.impactOccurred('light'); } catch(e) {} },
  medium: () => { try { tg?.HapticFeedback?.impactOccurred('medium'); } catch(e) {} },
  heavy: () => { try { tg?.HapticFeedback?.impactOccurred('heavy'); } catch(e) {} },
  success: () => { try { tg?.HapticFeedback?.notificationOccurred('success'); } catch(e) {} },
  error: () => { try { tg?.HapticFeedback?.notificationOccurred('error'); } catch(e) {} },
  selection: () => { try { tg?.HapticFeedback?.selectionChanged(); } catch(e) {} },
};

export const closeApp = () => {
  try { tg?.close(); } catch(e) {}
};