import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { StoreConfig } from '../types';

interface StoreConfigContextType {
  config: StoreConfig;
  updateConfig: (updates: Partial<StoreConfig>) => void;
  resetConfig: () => void;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'cm-hogar-config';

export const defaultConfig: StoreConfig = {
  email: import.meta.env.VITE_STORE_EMAIL || 'contacto@cymhogar.com.ar',
  phone: import.meta.env.VITE_STORE_PHONE || '+54 11 1234-5678',
  address: import.meta.env.VITE_STORE_ADDRESS || 'Av. Principal 123, CABA',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5491112345678',
  heroTitle: 'Tu Hogar, Tu Estilo',
  heroSubtitle: 'Encontrá los mejores electrodomésticos y muebles para tu hogar con la calidad y confianza que merecés.',
  heroImage: '/hero-appliances.jpg',
  freeShippingThreshold: 500000,
};

function loadConfigFromStorage(): StoreConfig {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function StoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(loadConfigFromStorage);

  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<StoreConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  };

  return (
    <StoreConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig(): StoreConfigContextType {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider');
  }
  return context;
}
