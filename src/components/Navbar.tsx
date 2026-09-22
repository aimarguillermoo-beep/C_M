import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-white'}`} style={{ backdropFilter: isScrolled ? 'blur(12px)' : 'none' }}>
      <div className="wrapper flex items-center justify-between" style={{ height: '64px' }}>
        <Link to="/" className="flex items-center gap-2 group">
          <Home className="w-5 h-5 text-tan-gold group-hover:scale-110 transition-transform" />
          <span className="font-heading text-xl font-bold text-brown-dark">C<span className="font-body">&</span>M Hogar</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}
              className={`text-sm font-medium transition-colors hover:text-tan-gold ${isActive(link.path) ? 'text-tan-gold' : 'text-brown-medium'}`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-sm text-tan-gold font-medium hover:text-brown-dark transition-colors">
              <Shield size={16} />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-brown-dark hover:text-tan-gold transition-colors" aria-label="Carrito">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-tan-gold text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
            )}
          </button>
          <button className="md:hidden p-2 text-brown-dark" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menú">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-cream-dark animate-slide-down">
          <div className="wrapper flex flex-col py-2">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm font-medium ${isActive(link.path) ? 'bg-cream text-tan-gold' : 'text-brown-dark hover:bg-cream-light'}`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg text-sm font-medium text-tan-gold hover:bg-cream-light flex items-center gap-2"
              >
                <Shield size={18} />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
