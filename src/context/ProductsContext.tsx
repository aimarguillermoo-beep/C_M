import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../types';
import { products as staticProducts, categories as staticCategories } from '../data/products';

interface ProductsContextType {
  products: Product[];
  categories: typeof staticCategories;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'cm-hogar-products';

function loadProductsFromStorage(): Product[] | null {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveProductsToStorage(products: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    return loadProductsFromStorage() || staticProducts;
  });

  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  const categories = staticCategories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.name).length,
  }));

  const addProduct = (product: Omit<Product, 'id'>) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    setProducts(prev => [...prev, { ...product, id: maxId + 1 } as Product]);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(staticProducts);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  return (
    <ProductsContext.Provider value={{ products, categories, addProduct, updateProduct, deleteProduct, resetProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
