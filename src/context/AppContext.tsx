import { createContext, useContext, useState, ReactNode } from 'react';
import { appSettings, Settings } from '../data/mockData';

interface AppContextType {
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(appSettings);

  const updateSettings = (s: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  };

  return (
    <AppContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
