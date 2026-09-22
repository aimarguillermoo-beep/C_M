import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useStoreConfig } from '../context/StoreConfigContext';

export default function Contact() {
  const { config } = useStoreConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=Hola%20C&M%20Hogar,%20tengo%20una%20consulta`;

  return (
    <div className="bg-cream min-h-screen">
      {/* Header Banner */}
      <div className="bg-brown-dark py-20 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Contactanos</h1>
        <p className="text-tan-light max-w-2xl mx-auto text-lg">
          Estamos acá para ayudarte a encontrar el estilo perfecto para tu hogar.
        </p>
      </div>

      <div className="wrapper py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-brown-dark mb-6">Envianos un mensaje</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in h-64">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <Send className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">¡Mensaje enviado!</h3>
                  <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brown-medium mb-1">Nombre completo</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-tan-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark bg-cream-light/50" 
                        placeholder="Tu nombre..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full border border-tan-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark bg-cream-light/50" 
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Asunto</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full border border-tan-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark bg-cream-light/50" 
                      placeholder="Motivo de tu consulta..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-medium mb-1">Mensaje</label>
                    <textarea 
                      required 
                      rows={5} 
                      className="w-full border border-tan-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-tan-gold outline-none text-brown-dark bg-cream-light/50 resize-none"
                      placeholder="Escribí tu mensaje acá..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-tan-gold hover:bg-brown-dark text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center gap-2 justify-center w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? 'Enviando...' : <><Send size={18} /> Enviar Mensaje</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-cream-light rounded-3xl p-8 border border-tan-light/30">
              <h3 className="text-xl font-bold text-brown-dark mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-tan-gold shadow-sm shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brown-dark">Dirección</h4>
                    <p className="text-brown-medium mt-1">{config.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-tan-gold shadow-sm shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brown-dark">Teléfono</h4>
                    <p className="text-brown-medium mt-1">{config.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-tan-gold shadow-sm shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brown-dark">Email</h4>
                    <p className="text-brown-medium mt-1">{config.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-tan-gold shadow-sm shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brown-dark">Horario de Atención</h4>
                    <p className="text-brown-medium mt-1">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-brown-medium">Sáb: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white p-6 rounded-3xl shadow-md flex items-center gap-4 transition-colors group"
            >
              <div className="bg-white/20 p-3 rounded-full">
                <MessageCircle size={32} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 group-hover:underline">Contactanos por WhatsApp</h4>
                <p className="text-white/80 text-sm">Respuesta rápida asegurada</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
