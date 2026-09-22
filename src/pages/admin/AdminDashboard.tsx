import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';
import { formatPrice } from '../../data/products';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const totalRevenue = orders
    .filter(o => o.status !== 'pending')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: 'Pendiente',
    preparing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen general de tu tienda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-tan-gold">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pedidos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrders.length}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${pendingOrders.length > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400'}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Últimos Pedidos</h2>
            <Link to="/admin/pedidos" className="text-sm text-tan-gold hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">#{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay pedidos recientes
              </div>
            )}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alertas de Stock
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-100" />
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {product.stock} en stock
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay alertas de stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
