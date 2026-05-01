import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Check, Info } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function Grooming() {
  const [activeTab, setActiveTab] = useState<'services' | 'pricing'>('services');
  const { config, services } = useConfig();
  
  if (!config) return null;

  const groomingServices = services.filter(s => s.category === 'grooming');
  const groomingListItems = (config.groomingServicesList || '').split('\n').filter(s => s.trim());
  const galleryUrls = (config.groomingGalleryUrls || '')
    .split(/[\n,;]+/)
    .map(s => s.trim().replace(/\s+/g, ''))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
          <Scissors className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Salon de Toilettage</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto whitespace-pre-wrap">
          {config.groomingSubtitle}
        </p>
        
        {/* Avant/Après Gallery */}
        {galleryUrls.length > 0 && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryUrls.map((url, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100 relative group flex items-center justify-center">
                <img 
                  src={url} 
                  alt={`Réalisation avant/après ${i + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500 z-10" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none'; // Completely hide broken image
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.error-msg')) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'error-msg flex flex-col items-center justify-center p-4 text-center z-0 w-full h-full';
                      errorDiv.innerHTML = '<span class="text-red-500 font-bold mb-1 text-sm bg-red-50 px-2 py-1 rounded">URL Invalide</span><span class="text-xs text-stone-500 max-w-full break-all mt-2">' + url.substring(0, 30) + '...</span>';
                      parent.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-stone-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Prestations
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pricing'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Tarifs indicatifs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden min-h-[400px]">
        {activeTab === 'services' ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-stone-900 mb-6">{config.groomingServicesTitle}</h2>
            <div className="grid gap-6">
              {groomingListItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-lg text-stone-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800 whitespace-pre-wrap">
                {config.groomingServicesNote}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-stone-900 mb-6">{config.groomingPricingTitle}</h2>
            <p className="text-stone-500 mb-8 text-sm whitespace-pre-wrap">
              {config.groomingPricingNote}
            </p>
            
            <div className="overflow-hidden rounded-xl border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Taille / Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Prix à partir de
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                  {groomingServices.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                        {row.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 text-right font-semibold">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                  {groomingServices.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-10 text-center text-stone-400 italic">
                        Aucun tarif configuré pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
