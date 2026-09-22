import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useProducts } from '../context/ProductsContext';

export default function Products() {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('categoria');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'Todos');
  const [sortBy, setSortBy] = useState('Mas populares');

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory === 'Todos') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', selectedCategory);
    }
    setSearchParams(searchParams);
  }, [selectedCategory, searchParams, setSearchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'Menor precio': return a.price - b.price;
      case 'Mayor precio': return b.price - a.price;
      case 'Mejor valorados': return b.rating - a.rating;
      case 'Mas populares': 
      default: return b.reviews - a.reviews;
    }
  });

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="wrapper">
        <h1 className="font-heading text-4xl text-brown-dark mb-8 text-center">Nuestros Productos</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
          <div className="w-full md:w-1/3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto pb-2 flex gap-2 hide-scrollbar">
            <button 
              onClick={() => setSelectedCategory('Todos')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'Todos' ? 'bg-brown-dark text-white' : 'bg-cream-light text-brown-medium hover:bg-tan-light/30'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.name ? 'bg-brown-dark text-white' : 'bg-cream-light text-brown-medium hover:bg-tan-light/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            <label className="text-sm text-brown-medium">Ordenar por:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-tan-light rounded-lg px-3 py-2 text-sm text-brown-dark outline-none focus:border-tan-gold"
            >
              <option value="Mas populares">Más populares</option>
              <option value="Menor precio">Menor precio</option>
              <option value="Mayor precio">Mayor precio</option>
              <option value="Mejor valorados">Mejor valorados</option>
            </select>
          </div>
        </div>

        <p className="text-brown-medium mb-6">Mostrando {filteredProducts.length} productos</p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-cream-light rounded-2xl">
            <p className="text-xl text-brown-medium mb-4">No se encontraron productos que coincidan con tu búsqueda.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="text-tan-gold hover:text-brown-dark font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
