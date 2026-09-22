import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const getDiscountPercentage = (price: number, original?: number) => {
    if (!original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const displayImage = product.images?.[0] || product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-tan-light/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link to={`/producto/${product.id}`} className="relative block overflow-hidden aspect-square bg-cream-light">
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-rose-soft text-white text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </div>
        )}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.colors.slice(0, 5).map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-white bg-black/50 rounded-full px-1.5 flex items-center">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-brown-medium uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-tan-gold text-tan-gold" />
            <span className="text-xs text-brown-medium">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/producto/${product.id}`} className="block mb-2">
          <h3 className="font-heading text-lg font-bold text-brown-dark line-clamp-2 hover:text-tan-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-brown-medium mb-4">{product.brand}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-tan-gold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-brown-medium line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdded || product.stock === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-tan-gold hover:bg-[#a38056] text-white'
            }`}
            aria-label="Agregar al carrito"
          >
            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
