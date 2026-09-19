// Telegram WebApp wrapper
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export const tg = window.Telegram?.WebApp;

export const initTelegram = () => {
  try {
    if (tg) {
      tg.ready();
      tg.expand();
      try { tg.setHeaderColor('#1a1a1a'); } catch(e) { console.log('setHeaderColor error:', e); }
      try { tg.setBackgroundColor('#1a1a1a'); } catch(e) { console.log('setBackgroundColor error:', e); }
    }
  } catch (e) {
    console.log('Telegram WebApp init error:', e);
  }
};

export const getUser = () => {
  try {
    return tg?.initDataUnsafe?.user || {
      id: 123456789,
      first_name: 'Гость',
      last_name: '',
      username: 'guest',
    };
  } catch (e) {
    return {
      id: 123456789,
      first_name: 'Гость',
      last_name: '',
      username: 'guest',
    };
  }
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