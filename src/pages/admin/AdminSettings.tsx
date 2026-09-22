import React, { useState, useRef } from 'react';
import { Save, Download, Upload, RotateCcw } from 'lucide-react';
import { useStoreConfig, defaultConfig } from '../../context/StoreConfigContext';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';

export default function AdminSettings() {
  const { config, updateConfig, resetConfig } = useStoreConfig();
  const { products, resetProducts } = useProducts();
  const { orders, clearOrders } = useOrders();
  
  const [formData, setFormData] = useState(config);
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = {
      config: formData,
      products,
      orders
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cm-hogar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.config) localStorage.setItem('storeConfig', JSON.stringify(json.config));
        if (json.products) localStorage.setItem('storeProducts', JSON.stringify(json.products));
        if (json.orders) localStorage.setItem('storeOrders', JSON.stringify(json.orders));
        
        alert('Datos importados correctamente. La página se recargará.');
        window.location.reload();
      } catch (error) {
        alert('Error al leer el archivo. Asegúrate de que es un backup válido.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFullReset = () => {
    resetConfig();
    resetProducts();
    clearOrders();
    setShowResetConfirm(false);
    setFormData(defaultConfig);
    alert('Tienda reseteada a valores de fábrica.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Ajustes generales de la tienda online</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Contacto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (con código país, ej: 54911...)</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección física</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Hero Banner (Inicio)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título principal</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen de fondo</label>
              <input type="url" name="heroImage" value={formData.heroImage} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required />
            </div>
          </div>
        </div>

        {/* Envío */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Envío</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Umbral de Envío Gratis ($)</label>
            <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} className="w-full md:w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-tan-gold outline-none" required min="0" />
            <p className="text-sm text-gray-500 mt-1">Los pedidos que superen este monto tendrán envío gratuito. Pon 0 para desactivar.</p>
          </div>
        </div>

        <button type="submit" className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-tan-gold text-white hover:bg-yellow-600'}`}>
          <Save className="w-5 h-5" />
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </button>
      </form>

      {/* Gestión de Datos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Gestión de Datos</h2>
        <p className="text-sm text-gray-500 mb-6">Realiza copias de seguridad de tus productos, pedidos y configuraciones.</p>
        
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors">
            <Download className="w-4 h-4" /> Exportar Backup
          </button>
          
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors">
            <Upload className="w-4 h-4" /> Importar Backup
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          
          <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors ml-auto">
            <RotateCcw className="w-4 h-4" /> Resetear Todo
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-red-800">¿Estás seguro?</p>
              <p className="text-sm text-red-600">Esto borrará TODOS los pedidos, restaurará los productos y la configuración a los valores iniciales.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={handleFullReset} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Sí, resetear todo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
