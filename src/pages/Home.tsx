import { Link } from 'react-router-dom';
import { Truck, Shield, CreditCard, Mail, ArrowRight } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

export default function Home() {
  const { products, categories } = useProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="py-20 bg-cream-light">
        <div className="wrapper">
          <div className="text-center mb-14">
            <p className="text-tan-gold font-medium text-sm tracking-widest uppercase mb-3">Categorías</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brown-dark">
              Explorá Nuestras Categorías
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="wrapper">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <p className="text-tan-gold font-medium text-sm tracking-widest uppercase mb-3">Lo Mejor</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brown-dark">
                Productos Destacados
              </h2>
            </div>
            <Link
              to="/productos"
              className="hidden sm:inline-flex items-center gap-2 text-tan-gold hover:text-tan-hover font-medium transition-colors group"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-tan-gold text-white px-8 py-3 rounded-full font-medium hover:bg-tan-hover transition-colors"
            >
              Ver todos los productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 bg-gradient-to-br from-brown-dark via-brown-medium to-brown-dark text-white">
        <div className="wrapper">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Envío gratis en compras mayores a $500.000
            </h2>
            <p className="text-cream/80 text-lg max-w-2xl mx-auto">
              Disfrutá de la mejor calidad en tu hogar con nuestros beneficios exclusivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Truck, title: 'Envío Gratis', desc: 'Superando los $500.000' },
              { icon: Shield, title: 'Garantía Oficial', desc: 'En todos nuestros productos' },
              { icon: CreditCard, title: 'Hasta 12 Cuotas', desc: 'Con tarjetas seleccionadas' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center text-center border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-14 h-14 rounded-full bg-tan-gold/20 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-tan-gold" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm text-cream/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream-light">
        <div className="wrapper" style={{ maxWidth: '48rem' }}>
          <div className="bg-brown-dark rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-tan-gold/10 rounded-full" style={{ filter: 'blur(50px)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-soft/10 rounded-full" style={{ filter: 'blur(40px)' }} />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-tan-gold/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-tan-gold" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                Suscribite a nuestras ofertas
              </h2>
              <p className="text-tan-light/80 mb-8 max-w-md mx-auto text-sm">
                Recibí las últimas novedades, descuentos exclusivos y tips para tu hogar.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Tu email..."
                  className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-tan-gold focus:border-transparent text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-tan-gold hover:bg-tan-hover text-white font-medium px-7 py-3 rounded-full transition-colors text-sm whitespace-nowrap"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
