import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, MessageCircle, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, getDiscountPercentage } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4 text-center">
        <h2 className="font-heading text-4xl text-brown-dark mb-4">Producto no encontrado</h2>
        <p className="text-brown-medium mb-8">El producto que estás buscando no existe o fue removido.</p>
        <Link to="/productos" className="bg-tan-gold text-white px-6 py-3 rounded-full hover:bg-brown-dark transition-colors">
          Volver a productos
        </Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImages = selectedColorIndex !== null && product.colors?.[selectedColorIndex]?.images?.length
    ? product.colors[selectedColorIndex].images
    : productImages;
  const currentImage = currentImages[selectedImageIndex] || currentImages[0];

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice ? getDiscountPercentage(product.price, product.originalPrice) : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleColorSelect = (index: number | null) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  };

  const whatsappMessage = encodeURIComponent(`Hola, me interesa el producto "${product.name}". ¿Me podrían dar más información?`);
  const whatsappUrl = `https://wa.me/5491112345678?text=${whatsappMessage}`;

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="wrapper">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-brown-medium mb-8">
          <Link to="/" className="hover:text-tan-gold transition-colors">Inicio</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/productos" className="hover:text-tan-gold transition-colors">Productos</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-brown-dark font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col lg:flex-row mb-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2 p-8 flex flex-col items-center justify-center bg-cream-light">
            <div className="w-full max-w-md aspect-square flex items-center justify-center mb-4">
              <img 
                src={currentImage} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            {currentImages.length > 1 && (
              <div className="flex gap-3 justify-center">
                {currentImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i 
                        ? 'border-tan-gold shadow-md scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2">
              <span className="inline-block bg-tan-light/30 text-brown-dark px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.brand}
              </span>
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl text-brown-dark mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-tan-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-brown-medium">{product.rating} ({product.reviews} reseñas)</span>
            </div>
            
            <div className="mb-6 flex items-end gap-3">
              <span className="text-3xl font-bold text-tan-gold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-brown-medium line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-rose-soft text-white px-2 py-1 rounded text-xs font-bold mb-1">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="font-medium text-brown-dark mb-3 block text-sm">
                  Color: <span className="text-tan-gold">{selectedColorIndex !== null ? product.colors[selectedColorIndex].name : 'Original'}</span>
                </span>
                <div className="flex gap-3 items-center flex-wrap">
                  <button
                    onClick={() => handleColorSelect(null)}
                    className={`w-9 h-9 rounded-full border-2 transition-all bg-gradient-to-br from-gray-200 to-gray-400 ${
                      selectedColorIndex === null ? 'border-tan-gold ring-2 ring-tan-gold/30 scale-110' : 'border-gray-300 hover:scale-105'
                    }`}
                    title="Original"
                  />
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => handleColorSelect(i)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColorIndex === i ? 'border-tan-gold ring-2 ring-tan-gold/30 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-brown-medium mb-8 leading-relaxed">
              {product.description}
            </p>
            
            {product.specs && (
              <div className="mb-8">
                <h3 className="font-bold text-brown-dark mb-3">Especificaciones:</h3>
                <div className="bg-cream-light rounded-xl overflow-hidden text-sm">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div key={key} className={`flex px-4 py-3 ${index % 2 === 0 ? 'bg-black/5' : ''}`}>
                      <span className="w-1/3 font-semibold text-brown-dark capitalize">{key}</span>
                      <span className="w-2/3 text-brown-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-brown-dark">Cantidad:</span>
                <div className="flex items-center bg-cream-light rounded-full border border-tan-light/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-brown-dark hover:text-tan-gold transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-medium text-brown-dark">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-brown-dark hover:text-tan-gold transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <span className="text-xs text-brown-medium">{product.stock} disponibles</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-full font-bold flex justify-center items-center gap-2 transition-all ${
                    added ? 'bg-green-600 text-white' : 'bg-tan-gold text-white hover:bg-brown-dark'
                  }`}
                >
                  {added ? (
                    <><Check size={20} /> ¡Agregado!</>
                  ) : (
                    <><ShoppingCart size={20} /> Agregar al Carrito</>
                  )}
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-full font-bold border-2 border-tan-gold text-tan-gold hover:bg-tan-gold hover:text-white transition-colors"
                >
                  Comprar Ahora
                </button>
              </div>
              
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-green-600 font-medium hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={20} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="animate-slide-up">
            <h2 className="font-heading text-3xl text-brown-dark mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
