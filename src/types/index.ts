export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  specs?: Record<string, string>;
  colors?: ProductColor[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      number: string;
      apartment?: string;
      city: string;
      province: string;
      zipCode: string;
    };
    notes?: string;
  };
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
  total: number;
  shippingCost: number;
  createdAt: string;
}

export interface StoreConfig {
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  freeShippingThreshold: number;
}
