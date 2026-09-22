import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { categories } from '../../data/products';
import type { ProductColor } from '../../types';

const COLOR_PALETTE = [
  { name: 'Negro', hex: '#1a1a1a' },
  { name: 'Blanco', hex: '#f5f5f5' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Gris Claro', hex: '#c0c0c0' },
  { name: 'Rojo', hex: '#dc2626' },
  { name: 'Azul', hex: '#2563eb' },
  { name: 'Verde', hex: '#16a34a' },
  { name: 'Amarillo', hex: '#eab308' },
  { name: 'Rosa', hex: '#ec4899' },
  { name: 'Naranja', hex: '#ea580c' },
  { name: 'Violeta', hex: '#7c3aed' },
  { name: 'Celeste', hex: '#06b6d4' },
  { name: 'Marrón', hex: '#78350f' },
  { name: 'Beige', hex: '#d4b896' },
  { name: 'Dorado', hex: '#b8956a' },
  { name: 'Plateado', hex: '#a8a8a8' },
];

interface SpecInput {
  key: string;
  value: string;
}

interface ColorInput {
  name: string;
  hex: string;
  images: [string, string, string];
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: categories[0]?.name || '',
    price: '',
    originalPrice: '',
    stock: '0',
    rating: '5',
    reviews: '0',
    images: ['', '', ''] as [string, string, string],
    featured: false,
  });

  const [specs, setSpecs] = useState<SpecInput[]>([{ key: '', value: '' }]);
  const [colors, setColors] = useState<ColorInput[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        const imgs = product.images || [product.image];
        setFormData({
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: product.category,
          price: product.price.toString(),
          originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
          stock: product.stock.toString(),
          rating: product.rating.toString(),
          reviews: product.reviews.toString(),
          images: [imgs[0] || '', imgs[1] || '', imgs[2] || ''],
          featured: !!product.featured,
        });

        if (product.specs && Object.keys(product.specs).length > 0) {
          setSpecs(Object.entries(product.specs).map(([key, value]) => ({ key, value })));
        }

        if (product.colors && product.colors.length > 0) {
          setColors(product.colors.map(c => ({
            name: c.name,
            hex: c.hex,
            images: [c.images[0] || '', c.images[1] || '', c.images[2] || ''],
          })));
        }
      } else {
        navigate('/admin/productos');
      }
    }
  }, [id, isEditing, products, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images] as [string, string, string];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  // Specs
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };
  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs.length ? newSpecs : [{ key: '', value: '' }]);
  };

  // Colors
  const addColor = () => {
    setColors([...colors, { name: '', hex: '#808080', images: ['', '', ''] }]);
  };
  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };
  const updateColor = (index: number, updates: Partial<ColorInput>) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
  };
  const updateColorImage = (colorIndex: number, imageIndex: number, value: string) => {
    setColors(prev => prev.map((c, ci) => {
      if (ci !== colorIndex) return c;
      const newImages = [...c.images] as [string, string, string];
      newImages[imageIndex] = value;
      return { ...c, images: newImages };
    }));
  };
  const selectPaletteColor = (colorIndex: number, palette: { name: string; hex: string }) => {
    updateColor(colorIndex, { name: palette.name, hex: palette.hex });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedSpecs: Record<string, string> = {};
    specs.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        formattedSpecs[spec.key.trim()] = spec.value.trim();
      }
    });

    const filteredImages = formData.images.filter(img => img.trim() !== '');
    const filteredColors: ProductColor[] = colors
      .filter(c => c.name.trim() && c.hex.trim())
      .map(c => ({
        name: c.name.trim(),
        hex: c.hex.trim(),
        images: c.images.filter(img => img.trim() !== ''),
      }));

    const productData = {
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 5,
      reviews: parseInt(formData.reviews) || 0,
      image: filteredImages[0] || '',
      images: filteredImages.length > 0 ? filteredImages : undefined,
      featured: formData.featured,
      specs: Object.keys(formattedSpecs).length > 0 ? formattedSpecs : undefined,
      colors: filteredColors.length > 0 ? filteredColors : undefined,
    };

    if (isEditing && id) {
      updateProduct(parseInt(id), productData);
    } else {
      addProduct(productData);
    }

    navigate('/admin/productos');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/productos" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Información General</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea required name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none bg-white">
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Precios y Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Actual ($) *</label>
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original ($) <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible *</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex justify-between items-center">
              Especificaciones
              <button type="button" onClick={addSpec} className="text-sm text-tan-gold hover:text-yellow-600 flex items-center gap-1 font-medium">
                <Plus className="w-4 h-4" /> Añadir
              </button>
            </h2>
            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" placeholder="Ej: Material" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} className="w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none text-sm" />
                  <input type="text" placeholder="Ej: Acero Inoxidable" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none text-sm" />
                  <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Color Variants */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex justify-between items-center">
              Variantes de Color
              <button type="button" onClick={addColor} className="text-sm text-tan-gold hover:text-yellow-600 flex items-center gap-1 font-medium">
                <Plus className="w-4 h-4" /> Agregar Color
              </button>
            </h2>

            {colors.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Sin variantes de color. Los colores son opcionales.</p>
            ) : (
              <div className="space-y-6">
                {colors.map((color, ci) => (
                  <div key={ci} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-inner" style={{ backgroundColor: color.hex || '#ccc' }} />
                        <span className="font-medium text-gray-900 text-sm">{color.name || 'Nuevo color'}</span>
                      </div>
                      <button type="button" onClick={() => removeColor(ci)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Palette */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Elegir de la paleta</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {COLOR_PALETTE.map(pc => (
                          <button
                            key={pc.hex}
                            type="button"
                            onClick={() => selectPaletteColor(ci, pc)}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${
                              color.hex === pc.hex ? 'border-tan-gold scale-110 ring-2 ring-tan-gold/30' : 'border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: pc.hex }}
                            title={pc.name}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={color.name} onChange={e => updateColor(ci, { name: e.target.value })} placeholder="Nombre del color" className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-tan-gold outline-none" />
                        <div className="flex items-center gap-2 border rounded-md px-2">
                          <input type="color" value={color.hex} onChange={e => updateColor(ci, { hex: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                          <input type="text" value={color.hex} onChange={e => updateColor(ci, { hex: e.target.value })} placeholder="#000000" className="w-20 p-2 text-sm outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* Color images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes para "{color.name || 'este color'}"</label>
                      <div className="grid grid-cols-3 gap-3">
                        {color.images.map((img, ii) => (
                          <div key={ii}>
                            <input
                              type="url"
                              value={img}
                              onChange={e => updateColorImage(ci, ii, e.target.value)}
                              placeholder="https://..."
                              className="w-full p-1.5 border rounded-md text-xs focus:ring-2 focus:ring-tan-gold outline-none mb-1"
                            />
                            <div className="aspect-square rounded-lg border border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
                              {img ? (
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-300" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Imágenes del Producto</h2>
            <p className="text-xs text-gray-500">Hasta 3 imágenes. La primera es la principal.</p>

            <div className="space-y-4">
              {formData.images.map((img, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {i === 0 ? 'Principal *' : `Imagen ${i + 1} (opcional)`}
                  </label>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                    placeholder="https://..."
                    required={i === 0}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none text-sm mb-2"
                  />
                  <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {img ? (
                      <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs">{i === 0 ? 'Principal' : 'Opcional'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Opciones</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-tan-gold rounded focus:ring-tan-gold" />
              <div>
                <p className="font-medium text-gray-900">Producto Destacado</p>
                <p className="text-sm text-gray-500">Mostrar en la sección principal del inicio</p>
              </div>
            </label>
          </div>

          <button type="submit" className="w-full bg-tan-gold text-white font-bold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm">
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
