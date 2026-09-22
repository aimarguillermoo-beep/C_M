import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      const formattedOrders: Order[] = data.map(o => ({
        id: o.id,
        customerInfo: o.customer_info,
        items: o.items,
        status: o.status,
        total: o.total,
        shippingCost: o.shipping_cost,
        createdAt: o.created_at
      }));
      setOrders(formattedOrders);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const id = `CM-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Optimistic UI
    setOrders(prev => [newOrder, ...prev]);

    await supabase.from('orders').insert({
      id: newOrder.id,
      customer_info: newOrder.customerInfo,
      items: newOrder.items,
      status: newOrder.status,
      total: newOrder.total,
      shipping_cost: newOrder.shippingCost,
      created_at: newOrder.createdAt
    });

    return id;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from('orders').delete().eq('id', id);
  };

  const clearOrders = async () => {
    setOrders([]);
    // Warning: En un entorno real borraríamos solo de la UI o pediríamos confirmación
    // Esto borra todo de la tabla pedidos.
    await supabase.from('orders').delete().neq('id', '0'); // Hack to delete all
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextType {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
