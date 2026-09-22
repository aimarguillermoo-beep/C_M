import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStoreConfig } from '../context/StoreConfigContext';

const HeroBanner = () => {
  const { config } = useStoreConfig();
  return (
    <section className="relative overflow-hidden bg-cream" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url('${config.heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} 
      />
      
      {/* Overlay: Semi-transparent on the left for text readability, fading completely to transparent on the right */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-cream/80 via-cream/40 to-transparent" />

      {/* Decorative gradient orbs */}
      <div className="absolute rounded-full bg-gradient-to-br from-tan-gold/20 to-rose-soft/20 z-0" style={{ top: '-20%', right: '-10%', width: '500px', height: '500px', filter: 'blur(80px)' }} />
      <div className="absolute rounded-full bg-gradient-to-tr from-rose-soft/20 to-tan-light/20 z-0" style={{ bottom: '-10%', left: '-5%', width: '400px', height: '400px', filter: 'blur(80px)' }} />

      <div className="wrapper relative z-10" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '48rem' }}>
          <p className="text-tan-gold font-medium tracking-widest uppercase animate-fade-in" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', letterSpacing: '0.15em' }}>
            C&M Hogar
          </p>
          <h1 className="font-heading font-bold text-brown-dark animate-slide-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
            {config.heroTitle}
          </h1>
          <p className="font-body text-brown-medium animate-slide-up" style={{ fontSize: '1.15rem', maxWidth: '36rem', lineHeight: 1.7, marginBottom: '2.5rem', animationDelay: '150ms' }}>
            {config.heroSubtitle}
          </p>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Link to="/productos"
              className="inline-flex items-center gap-3 bg-tan-gold hover:bg-tan-hover text-white rounded-full font-medium transition-all duration-300 group"
              style={{ padding: '1rem 2.25rem', fontSize: '1rem', boxShadow: '0 10px 25px -5px rgba(184, 149, 106, 0.3)' }}
            >
              Ver Catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--color-tan-light), transparent)', opacity: 0.5 }} />
    </section>
  );
};

export default HeroBanner;
