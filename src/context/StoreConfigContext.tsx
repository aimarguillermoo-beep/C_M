import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { StoreConfig } from '../types';

interface StoreConfigContextType {
  config: StoreConfig;
  updateConfig: (updates: Partial<StoreConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export const defaultConfig: StoreConfig = {
  email: 'contacto@cymhogar.com.ar',
  phone: '+54 11 1234-5678',
  address: 'Av. Principal 123, CABA',
  whatsappNumber: '5491112345678',
  heroTitle: 'Tu Hogar, Tu Estilo',
  heroSubtitle: 'Encontrá los mejores electrodomésticos y muebles para tu hogar con la calidad y confianza que merecés.',
  heroImage: '/hero-appliances.jpg',
  freeShippingThreshold: 500000,
};

export function StoreConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('store_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (data && !error) {
      setConfig({
        email: data.email,
        phone: data.phone,
        address: data.address,
        whatsappNumber: data.whatsapp_number,
        heroTitle: data.hero_title,
        heroSubtitle: data.hero_subtitle,
        heroImage: data.hero_image,
        freeShippingThreshold: data.free_shipping_threshold
      });
    }
  };

  const updateConfig = async (updates: Partial<StoreConfig>) => {
    // Optimistic UI
    setConfig(prev => ({ ...prev, ...updates }));

    const dbUpdates = {
      email: updates.email,
      phone: updates.phone,
      address: updates.address,
      whatsapp_number: updates.whatsappNumber,
      hero_title: updates.heroTitle,
      hero_subtitle: updates.heroSubtitle,
      hero_image: updates.heroImage,
      free_shipping_threshold: updates.freeShippingThreshold
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => dbUpdates[key as keyof typeof dbUpdates] === undefined && delete dbUpdates[key as keyof typeof dbUpdates]);

    await supabase
      .from('store_config')
      .update(dbUpdates)
      .eq('id', 1);
  };

  const resetConfig = async () => {
    setConfig(defaultConfig);
    const dbUpdates = {
      email: defaultConfig.email,
      phone: defaultConfig.phone,
      address: defaultConfig.address,
      whatsapp_number: defaultConfig.whatsappNumber,
      hero_title: defaultConfig.heroTitle,
      hero_subtitle: defaultConfig.heroSubtitle,
      hero_image: defaultConfig.heroImage,
      free_shipping_threshold: defaultConfig.freeShippingThreshold
    };
    await supabase.from('store_config').update(dbUpdates).eq('id', 1);
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
