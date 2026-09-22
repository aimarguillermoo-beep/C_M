import { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Trash2, Package } from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { formatPrice } from '../../data/products';
import type { Order } from '../../types';

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder, clearOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<Order['status'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    preparing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200'
  };

  const statusLabels = {
    pending: 'Pendiente',
    preparing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado'
  };

  const tabs: {id: Order['status'] | 'all', label: string}[] = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendiente' },
    { id: 'preparing', label: 'En preparación' },
    { id: 'shipped', label: 'Enviado' },
    { id: 'delivered', label: 'Entregado' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Pedidos <span className="text-sm font-normal text-gray-500 ml-2">({orders.length})</span></h1>
        </div>
        {orders.length > 0 && (
          <button 
            onClick={() => {
              if(window.confirm('¿Estás seguro de que deseas borrar todos los pedidos?')) clearOrders();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Borrar todos
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {tabs.map(tab => {
          const count = tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-brown-dark text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div 
                className="p-4 sm:p-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">#{order.id}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </div>
                  <div className="font-bold text-gray-900 text-lg">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-gray-400">
                    {expandedId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Card Body Expanded */}
              {expandedId === order.id && (
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Detalles del Cliente</h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-sm">
                        <p><strong>Nombre:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Teléfono:</strong> {order.customerInfo.phone}</p>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p><strong>Dirección:</strong> {order.customerInfo.address.street} {order.customerInfo.address.number} {order.customerInfo.address.apartment ? `Dpto ${order.customerInfo.address.apartment}` : ''}</p>
                          <p>{order.customerInfo.address.city}, {order.customerInfo.address.province}. CP: {order.customerInfo.address.zipCode}</p>
                        </div>
                        {order.customerInfo.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p><strong>Notas:</strong> {order.customerInfo.notes}</p>
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider pt-2">Acciones</h4>
                      <div className="flex items-center gap-3">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-tan-gold outline-none"
                        >
                          <option value="pending">Marcar como Pendiente</option>
                          <option value="preparing">Marcar como En preparación</option>
                          <option value="shipped">Marcar como Enviado</option>
                          <option value="delivered">Marcar como Entregado</option>
                        </select>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm('¿Eliminar este pedido?')) deleteOrder(order.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Productos ({order.items.reduce((a,b)=>a+b.quantity,0)})</h4>
                      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100">
                        {order.items.map(item => (
                          <div key={item.id} className="p-3 flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-100" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                            <div className="font-medium text-sm text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                        <div className="p-3 bg-gray-50 space-y-1 text-sm">
                          <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.total - order.shippingCost)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Envío</span>
                            <span>{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hay pedidos</h3>
            <p className="text-gray-500 mt-1">
              {activeTab === 'all' ? 'Aún no has recibido ningún pedido en tu tienda.' : 'No hay pedidos con este estado.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
