import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PawPrint, Scissors, Cat, Calendar, MapPin, Phone, Mail, Settings, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { config } = useConfig();
  const { user, isAdmin, logout } = useAuth();

  // Mettre à jour le titre de l'onglet avec le nom du site configuré
  useEffect(() => {
    if (config?.name) {
      document.title = config.name;
    }
  }, [config?.name]);

  const navItems = [
    { path: '/', label: 'Accueil', icon: PawPrint },
    { path: '/grooming', label: 'Salon de Toilettage', icon: Scissors },
    { path: '/boarding', label: 'Pension Féline', icon: Cat },
    { path: '/contact', label: 'Contact & Réservation', icon: Calendar },
  ];

  if (user && isAdmin) {
    navItems.push({ path: '/config', label: 'Configuration', icon: Settings });
  } else if (!user) {
    navItems.push({ path: '/config', label: 'Connexion', icon: LogIn });
  }

  if (!config) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-stone-900">
                  {config.name}
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {user && (
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200 flex items-center gap-1.5"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                        isActive
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-stone-500 tracking-wider uppercase mb-4">
                {config.name}
              </h3>
              <p className="text-base text-stone-600">
                {config.tagline}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-500 tracking-wider uppercase mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-stone-600">
                  <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                  {config.address}
                </li>
                <li className="flex items-center text-stone-600">
                  <Phone className="h-5 w-5 text-orange-500 mr-2" />
                  {config.phone}
                </li>
                <li className="flex items-center text-stone-600">
                  <Mail className="h-5 w-5 text-orange-500 mr-2" />
                  {config.email}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-500 tracking-wider uppercase mb-4">
                Horaires
              </h3>
              <p className="text-base text-stone-600 whitespace-pre-wrap">
                {config.hours}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-stone-200 pt-8 text-center">
            <p className="text-base text-stone-400">
              &copy; {new Date().getFullYear()} {config.name}. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
