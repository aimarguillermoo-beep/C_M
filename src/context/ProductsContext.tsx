import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../types';
import { products as staticProducts, categories as staticCategories } from '../data/products';
import { supabase } from '../lib/supabase';

interface ProductsContextType {
  products: Product[];
  categories: typeof staticCategories;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  resetProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    const { data: colorsData, error: colorsError } = await supabase
      .from('product_colors')
      .select('*');

    if (colorsError) {
      console.error('Error fetching product colors:', colorsError);
      return;
    }

    // Initialize with static data if completely empty
    if (!productsData || productsData.length === 0) {
      setProducts(staticProducts);
      return;
    }

    const mappedProducts: Product[] = productsData.map(p => {
      const pColors = colorsData?.filter(c => c.product_id === p.id).map(c => ({
        name: c.name,
        hex: c.hex,
        images: c.images || []
      })) || [];

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.original_price,
        image: p.image,
        images: p.images,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        featured: p.featured,
        specs: p.specs,
        colors: pColors.length > 0 ? pColors : undefined,
      };
    });

    setProducts(mappedProducts);
  };

  const categories = staticCategories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.name).length,
  }));

  const addProduct = async (product: Omit<Product, 'id'>) => {
    // Optimistic ID mapping (will be overwritten by DB)
    const tempId = Date.now();
    setProducts(prev => [...prev, { ...product, id: tempId } as Product]);

    const { data, error } = await supabase.from('products').insert({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      image: product.image,
      images: product.images || [],
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      featured: product.featured,
      specs: product.specs || {}
    }).select().single();

    if (data && !error && product.colors) {
      const colorInserts = product.colors.map(c => ({
        product_id: data.id,
        name: c.name,
        hex: c.hex,
        images: c.images
      }));
      await supabase.from('product_colors').insert(colorInserts);
    }
    
    // Refresh to get real IDs
    fetchProducts();
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    // Optimistic UI
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    const dbUpdates: any = {
      name: updates.name,
      description: updates.description,
      price: updates.price,
      original_price: updates.originalPrice,
      image: updates.image,
      images: updates.images,
      category: updates.category,
      brand: updates.brand,
      rating: updates.rating,
      reviews: updates.reviews,
      stock: updates.stock,
      featured: updates.featured,
      specs: updates.specs,
    };

    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    await supabase.from('products').update(dbUpdates).eq('id', id);

    // Si se actualizaron los colores
    if (updates.colors) {
      await supabase.from('product_colors').delete().eq('product_id', id);
      if (updates.colors.length > 0) {
        const colorInserts = updates.colors.map(c => ({
          product_id: id,
          name: c.name,
          hex: c.hex,
          images: c.images
        }));
        await supabase.from('product_colors').insert(colorInserts);
      }
    }
    
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const resetProducts = async () => {
    // Esta operacion seria peligrosa en prod. Borra y recrea.
    await supabase.from('products').delete().neq('id', 0);
    setProducts(staticProducts);
    
    // Opcional: Re-insertar estaticos a Supabase
    for (const p of staticProducts) {
      await supabase.from('products').insert({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        original_price: p.originalPrice,
        image: p.image,
        images: p.images || [p.image],
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        featured: p.featured,
        specs: p.specs || {}
      });
    }
    fetchProducts();
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
