import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useStoreConfig } from '../context/StoreConfigContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { config } = useStoreConfig();
  
  const shippingThreshold = config.freeShippingThreshold;
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 15000;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-cream-light p-8 rounded-full mb-6">
          <ShoppingBag size={64} className="text-tan-gold" />
        </div>
        <h2 className="font-heading text-3xl text-brown-dark mb-4">Tu carrito está vacío</h2>
        <p className="text-brown-medium mb-8 max-w-md">
          Parece que aún no has agregado productos a tu carrito. ¡Explorá nuestra tienda y encontrá lo que buscás!
        </p>
        <Link 
          to="/productos" 
          className="bg-tan-gold text-white px-8 py-3 rounded-full font-bold hover:bg-brown-dark transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8 px-4 md:px-8">
      <div className="wrapper">
        <nav className="flex items-center text-sm text-brown-medium mb-8">
          <Link to="/" className="hover:text-tan-gold transition-colors">Inicio</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-brown-dark font-medium">Mi Carrito</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl text-brown-dark mb-8">Mi Carrito</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              {/* Header (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-tan-light/30 text-sm font-semibold text-brown-medium">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Precio</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {/* Items */}
              <div className="divide-y divide-tan-light/30">
                {items.map(item => (
                  <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4">
                    <div className="md:col-span-6 flex gap-4">
                      <img src={item.images?.[0] || item.image} alt={item.name} className="w-24 h-24 object-contain bg-cream-light rounded-xl mix-blend-multiply p-2" />
                      <div className="flex flex-col justify-center">
                        <Link to={`/producto/${item.id}`} className="font-bold text-brown-dark hover:text-tan-gold transition-colors line-clamp-2 mb-1">
                          {item.name}
                        </Link>
                        <span className="text-xs text-brown-medium uppercase">{item.brand}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-rose-soft hover:text-red-600 text-sm flex items-center gap-1 mt-2 w-fit transition-colors"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 text-center hidden md:block text-brown-dark font-medium">
                      {formatPrice(item.price)}
                    </div>
                    
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center bg-cream-light rounded-full border border-tan-light/50 px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-brown-dark hover:text-tan-gold transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-brown-dark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-brown-dark hover:text-tan-gold transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 text-right font-bold text-tan-gold text-lg flex justify-between md:block">
                      <span className="md:hidden text-brown-medium font-normal text-sm">Subtotal:</span>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/productos" className="text-tan-gold hover:text-brown-dark font-medium flex items-center gap-2 transition-colors w-fit">
                &larr; Seguir comprando
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-brown-dark text-white rounded-3xl p-8 sticky top-24 shadow-lg">
              <h2 className="font-heading text-2xl mb-6 border-b border-white/10 pb-4">Resumen de Compra</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-cream-light/80">
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-cream-light/80">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? '¡Gratis!' : formatPrice(shippingCost)}</span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="bg-white/5 p-3 rounded-xl text-xs text-tan-light mt-2">
                    Te faltan {formatPrice(shippingThreshold - totalPrice)} para tener envío gratis.
                  </div>
                )}
              </div>
              
              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-3xl font-bold text-tan-gold">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="block w-full text-center bg-tan-gold hover:bg-tan-light text-brown-dark font-bold py-4 rounded-full transition-colors"
              >
                Finalizar Compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
