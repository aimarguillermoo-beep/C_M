import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail, Camera, ThumbsUp } from 'lucide-react';
import { useStoreConfig } from '../context/StoreConfigContext';

const Footer = () => {
  const { config } = useStoreConfig();
  const email = config.email;
  const phone = config.phone;
  const address = config.address;
  const whatsappNumber = config.whatsappNumber;

  return (
    <footer className="bg-brown-dark text-cream-light" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <h3 className="font-heading font-bold text-white" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>C<span className="font-body">&</span>M Hogar</h3>
            <p style={{ color: 'rgba(245,237,228,0.8)', lineHeight: 1.7 }}>
              Tu Hogar, Tu Estilo. Ofrecemos los mejores electrodomésticos y muebles para hacer de tu casa el lugar que siempre soñaste.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Categorías</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Refrigeración', 'Lavado', 'Cocina', 'Climatización', 'Tecnología', 'Muebles y Deco'].map(cat => (
                <li key={cat}>
                  <Link to={`/productos?categoria=${cat}`} className="hover:text-tan-gold transition-colors" style={{ color: 'rgba(245,237,228,0.8)' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Contacto</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(245,237,228,0.8)' }}>
                <MapPin className="w-5 h-5 text-tan-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{address}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(245,237,228,0.8)' }}>
                <Phone className="w-5 h-5 text-tan-gold" style={{ flexShrink: 0 }} />
                <span>{phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(245,237,228,0.8)' }}>
                <Mail className="w-5 h-5 text-tan-gold" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} className="hover:text-tan-gold transition-colors">{email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Seguinos</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:bg-tan-gold transition-colors" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-brown-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Camera className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:bg-tan-gold transition-colors" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-brown-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ThumbsUp className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:bg-tan-gold transition-colors" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-brown-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-brown-medium)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(245,237,228,0.5)', fontSize: '0.875rem' }}>
          <p>© {new Date().getFullYear()} C&M Hogar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
