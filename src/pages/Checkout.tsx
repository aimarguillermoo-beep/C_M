import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useOrders } from '../context/OrdersContext';
import { useStoreConfig } from '../context/StoreConfigContext';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  const { addOrder } = useOrders();
  const { config } = useStoreConfig();
  
  const shippingThreshold = config.freeShippingThreshold;
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 15000;
  const finalTotal = totalPrice + shippingCost;

  React.useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/carrito');
    }
  }, [items, navigate, isSuccess]);

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const customerInfo = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: {
        street: formData.get('street') as string,
        number: formData.get('number') as string,
        apartment: formData.get('apartment') as string,
        city: formData.get('city') as string,
        province: formData.get('province') as string,
        zipCode: formData.get('zipCode') as string,
      },
      notes: formData.get('notes') as string
    };
    
    const newOrderId = addOrder({
      items,
      customerInfo,
      total: finalTotal,
      shippingCost
    });
    
    setOrderId(newOrderId);
    setIsSuccess(true);
    clearCart();
    // Scroll to top for success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-cream flex flex-col items-center justify-center px-4 text-center py-20 animate-fade-in">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle size={80} className="text-green-600" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl text-brown-dark mb-4">¡Pedido Confirmado!</h1>
        <p className="text-lg text-brown-medium mb-8 max-w-lg">
          Gracias por tu compra en C&M Hogar. Hemos enviado un correo con los detalles de tu pedido.
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 w-full max-w-md border border-tan-light/30">
          <div className="flex items-center gap-3 justify-center text-brown-dark font-medium mb-2">
            <Package size={20} />
            Número de pedido: #{orderId}
          </div>
          <p className="text-sm text-brown-medium">Te notificaremos cuando tu pedido esté en camino.</p>
        </div>
        <Link 
          to="/"
          className="bg-tan-gold hover:bg-brown-dark text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="wrapper">
        <nav className="flex items-center text-sm text-brown-medium mb-8">
          <Link to="/" className="hover:text-tan-gold transition-colors">Inicio</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/carrito" className="hover:text-tan-gold transition-colors">Mi Carrito</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-brown-dark font-medium">Checkout</span>
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl text-brown-dark mb-8">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-2/3">
            <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              {/* Datos Personales */}
              <div>
                <h2 className="text-xl font-bold text-brown-dark mb-4 border-b border-tan-light/30 pb-2">1. Datos Personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Nombre</label>
                    <input type="text" name="firstName" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Apellido</label>
                    <input type="text" name="lastName" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Email</label>
                    <input type="email" name="email" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Teléfono</label>
                    <input type="tel" name="phone" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div>
                <h2 className="text-xl font-bold text-brown-dark mb-4 border-b border-tan-light/30 pb-2">2. Dirección de Envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brown-medium mb-1">Calle</label>
                    <input type="text" name="street" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Número</label>
                    <input type="text" name="number" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Piso / Depto (Opcional)</label>
                    <input type="text" name="apartment" className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Ciudad</label>
                    <input type="text" name="city" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Provincia</label>
                    <input type="text" name="province" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Código Postal</label>
                    <input type="text" name="zipCode" required className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark" />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <h2 className="text-xl font-bold text-brown-dark mb-4 border-b border-tan-light/30 pb-2">3. Notas Adicionales</h2>
                <div>
                  <label className="block text-sm font-medium text-brown-medium mb-1">Comentarios para la entrega (Opcional)</label>
                  <textarea name="notes" rows={3} className="w-full border border-tan-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark resize-none"></textarea>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-tan-gold hover:bg-brown-dark text-white font-bold py-4 rounded-xl transition-colors text-lg mt-4 shadow-md"
              >
                Confirmar Pedido y Pagar
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-cream-light border border-tan-light/50 rounded-3xl p-6 sticky top-24">
              <h2 className="font-heading text-2xl text-brown-dark mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto hide-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-tan-light/30" />
                      <span className="absolute -top-2 -right-2 bg-brown-dark text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brown-dark line-clamp-1">{item.name}</h4>
                      <p className="text-tan-gold font-medium text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-tan-light pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-brown-medium text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-brown-medium text-sm">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                </div>
              </div>
              
              <div className="border-t border-tan-light pt-4 flex justify-between items-end">
                <span className="text-lg font-medium text-brown-dark">Total</span>
                <span className="text-2xl font-bold text-tan-gold">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
