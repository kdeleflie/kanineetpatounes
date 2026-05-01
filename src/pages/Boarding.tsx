import React from 'react';
import { motion } from 'motion/react';
import { Cat, ShieldCheck, Heart, MessageCircle, AlertTriangle, Star } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function Boarding() {
  const { config, boardingFeatures, services } = useConfig();
  const boardingPricing = services.filter(s => s.category === 'boarding');

  if (!config) return null;

  const conditionsList = config.boardingConditionsContent.split('\n').filter(s => s.trim());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 sm:px-0"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full text-orange-600 mb-4">
          <Cat className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Pension Féline</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto whitespace-pre-wrap">
          {config.boardingSubtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-3" />
            {config.boardingComfortTitle}
          </h2>
          <ul className="space-y-6">
            {boardingFeatures.map((f, i) => (
              <li key={f.id} className="flex">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-4">
                  {i % 2 === 0 ? <ShieldCheck className="w-5 h-5 text-orange-600" /> : <Star className="w-5 h-5 text-orange-600" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">{f.title}</h3>
                  <p className="text-stone-600">{f.description}</p>
                </div>
              </li>
            ))}
            {boardingFeatures.length === 0 && (
              <p className="text-stone-400 italic">Détails du séjour à venir...</p>
            )}
          </ul>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-4">{config.boardingPricingTitle}</h3>
            <div className="space-y-3">
              {boardingPricing.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                  <span className="text-stone-700">{p.title}</span>
                  <span className="font-bold text-stone-900">{p.price}</span>
                </div>
              ))}
              {boardingPricing.length === 0 && (
                <p className="text-stone-400 italic text-sm">{config.boardingPricingNote}</p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-yellow-800 mb-2">{config.boardingAlertTitle}</h3>
                <p className="text-yellow-700 whitespace-pre-wrap">
                  {config.boardingAlertContent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 mb-4">{config.boardingConditionsTitle}</h3>
            <ul className="list-disc list-inside space-y-2 text-stone-600">
              {conditionsList.map((condition, i) => (
                <li key={i}>{condition}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
