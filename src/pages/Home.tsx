import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

export default function Home() {
  const { config, links } = useConfig();

  if (!config) return null;

  const homeGalleryUrls = (config.homeGalleryUrls || '')
    .split(/[\n,;]+/)
    .map(s => s.trim().replace(/\s+/g, ''))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 px-4 sm:px-0"
    >
      {/* Hero Section */}
      <section className="relative bg-orange-50 rounded-3xl overflow-hidden shadow-sm border border-orange-100">
        <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div className="space-y-6 flex flex-col min-w-0 z-10 relative">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium self-start">
              <Star className="w-4 h-4 mr-1 fill-current" />
              Bienvenue à {config.address.split('(')[0].trim()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              {config.tagline}
            </h1>
            <div 
              className="text-lg text-stone-600 leading-relaxed [&_p]:mb-2 last:[&_p]:mb-0 w-full break-words"
              dangerouslySetInnerHTML={{ __html: config.description.replace(/&nbsp;/g, ' ') }}
            />
            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                to="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/grooming" 
                className="inline-flex items-center px-6 py-3 border border-stone-300 text-base font-medium rounded-xl text-stone-700 bg-white hover:bg-stone-50 transition-colors"
              >
                Découvrir nos services
              </Link>
              {links.map(l => (
                <a 
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-stone-300 text-base font-medium rounded-xl text-stone-700 bg-white hover:bg-stone-50 transition-colors"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src={config.heroImageUrl || `https://picsum.photos/seed/${config.logoSeed}/1920/1080`} 
              alt="Accueil" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Home Gallery Section */}
      {homeGalleryUrls.length > 0 && (
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {homeGalleryUrls.map((url, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100 relative group flex items-center justify-center">
                <img 
                  src={url} 
                  alt={`Photo galerie accueil ${i + 1}`} 
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
        </section>
      )}

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm8.486-.486a5 5 0 11-7.072-7.072 5 5 0 017.072 7.072z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Toilettage Complet</h2>
          <p className="text-stone-600 mb-6">
            Pour chiens et chats. Bain, brushing, tonte, coupe ciseaux ou épilation. 
            Nous prenons soin de toutes les races avec douceur.
          </p>
          <Link to="/grooming" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
            Voir les tarifs <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Pension Féline</h2>
          <p className="text-stone-600 mb-6">
            Un séjour tout confort avec box individuels et espaces de jeux. 
            Hygiène irréprochable et nouvelles régulières de votre compagnon.
          </p>
          <Link to="/boarding" className="text-green-600 font-medium hover:text-green-700 inline-flex items-center">
            En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-stone-900 text-white p-8 md:p-12 rounded-2xl text-center">
        <blockquote className="text-xl md:text-2xl font-medium italic opacity-90 mb-6">
          "Ici, nous privilégions la douceur et le confort pour que chaque animal se sente comme à la maison."
        </blockquote>
        <div className="flex items-center justify-center space-x-2 opacity-75">
          <div className="h-px w-8 bg-white"></div>
          <span className="text-sm uppercase tracking-widest">L'équipe Ka'nine & Patounes</span>
          <div className="h-px w-8 bg-white"></div>
        </div>
      </section>
    </motion.div>
  );
}
