import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

const CartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity, 
    totalPrice 
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-up sm:animate-none sm:translate-x-0 transition-transform duration-300">
        <div className="flex items-center justify-between p-5 border-b border-tan-light/50 bg-cream-light">
          <h2 className="font-heading text-xl font-bold text-brown-dark">
            Tu Carrito ({items.length})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-brown-medium hover:text-rose-soft transition-colors rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-tan-gold">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="font-body text-brown-medium text-lg">Tu carrito está vacío</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-3 bg-tan-gold hover:bg-[#a38056] text-white rounded-full font-medium transition-colors"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-tan-light/30 bg-cream shrink-0">
                    <img 
                      src={item.images?.[0] || item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-body font-medium text-brown-dark text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-brown-medium hover:text-rose-soft transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-1 text-sm font-bold text-tan-gold">
                      {formatPrice(item.price)}
                    </div>
                    
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-tan-light rounded-full bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-brown-dark hover:text-tan-gold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-brown-dark">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center text-brown-dark hover:text-tan-gold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-tan-light/50 p-5 bg-cream-light mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-brown-medium">Subtotal</span>
              <span className="font-heading font-bold text-xl text-brown-dark">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-tan-gold hover:bg-[#a38056] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                Finalizar Compra
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/carrito');
                }}
                className="w-full py-3.5 bg-white border border-tan-gold text-tan-gold hover:bg-cream rounded-xl font-medium transition-colors"
              >
                Ver Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
