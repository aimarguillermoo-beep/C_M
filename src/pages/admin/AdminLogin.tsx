import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brown-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
          <div className="w-16 h-16 bg-tan-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-brown-dark">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">C&M Hogar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-tan-gold focus:border-transparent outline-none transition-all border-gray-200"
              placeholder="tu@email.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-tan-gold focus:border-transparent outline-none transition-all ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Ingresa la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tan-gold text-white font-medium py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>

      <Link 
        to="/" 
        className="mt-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la tienda</span>
      </Link>
    </div>
  );
}
