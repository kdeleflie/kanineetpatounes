import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function Contact() {
  const { config } = useConfig();

  if (!config) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Nous Contacter</h1>
        <p className="text-lg text-stone-600">
          Pour toute question ou demande de rendez-vous, n'hésitez pas à nous écrire.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-1">Adresse</h3>
            <p className="text-stone-600">{config.address}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-1">Téléphone</h3>
            <p className="text-stone-600">{config.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-1">Email</h3>
            <p className="text-stone-600 break-all">{config.email}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Envoyez-nous un message</h2>
            <form action={`https://formspree.io/f/${config.formspreeId}`} method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                  Votre nom
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                  Votre email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="jean@exemple.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
                  Votre message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  placeholder="Bonjour, je souhaiterais prendre rendez-vous pour..."
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Envoyer le message
                <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
