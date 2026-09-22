import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { ProductsProvider } from './context/ProductsContext';
import { OrdersProvider } from './context/OrdersContext';
import { StoreConfigProvider } from './context/StoreConfigContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-light">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <div style={{ height: '64px' }} className="w-full"></div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <ProductsProvider>
        <OrdersProvider>
          <StoreConfigProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="productos" element={<AdminProducts />} />
                    <Route path="productos/nuevo" element={<AdminProductForm />} />
                    <Route path="productos/editar/:id" element={<AdminProductForm />} />
                    <Route path="pedidos" element={<AdminOrders />} />
                    <Route path="configuracion" element={<AdminSettings />} />
                  </Route>

                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Products />} />
                    <Route path="/producto/:id" element={<ProductDetail />} />
                    <Route path="/carrito" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contacto" element={<Contact />} />
                  </Route>
                </Routes>
              </Router>
            </CartProvider>
          </StoreConfigProvider>
        </OrdersProvider>
      </ProductsProvider>
    </AdminProvider>
  );
}

export default App;
