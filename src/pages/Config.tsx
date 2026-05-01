import React, { useState } from 'react';
import { useConfig, SiteConfig, Service, BoardingFeature, ExternalLink } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Save, Plus, Trash2, LogIn, Settings, List, Phone, Clock, Link as LinkIcon } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, deleteDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Config() {
  const { config, services, boardingFeatures, links, updateConfig, loading } = useConfig();
  const { user, isAdmin, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'boarding' | 'links'>('general');

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-stone-100 text-center">
        <Settings className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Administration</h1>
        <p className="text-stone-600 mb-8">
          Veuillez vous connecter avec votre compte administrateur pour modifier le site.
        </p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Se connecter avec Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Configuration du Site</h1>
          <p className="text-stone-500">Connecté en tant que {user.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="space-y-2">
          <TabButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')} 
            icon={<Settings className="w-5 h-5" />} 
            label="Général" 
          />
          <TabButton 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')} 
            icon={<List className="w-5 h-5" />} 
            label="Toilettage" 
          />
          <TabButton 
            active={activeTab === 'boarding'} 
            onClick={() => setActiveTab('boarding')} 
            icon={<Clock className="w-5 h-5" />} 
            label="Pension" 
          />
          <TabButton 
            active={activeTab === 'links'} 
            onClick={() => setActiveTab('links')} 
            icon={<LinkIcon className="w-5 h-5" />} 
            label="Liens" 
          />
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            {activeTab === 'general' && <GeneralConfig config={config!} onSave={updateConfig} />}
            {activeTab === 'services' && <ServicesConfig services={services} />}
            {activeTab === 'boarding' && <BoardingConfig features={boardingFeatures} />}
            {activeTab === 'links' && <LinksConfig links={links} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
          : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
}

function GeneralConfig({ config, onSave }: { config: SiteConfig, onSave: (c: Partial<SiteConfig>) => Promise<void> }) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Section Accueil */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-stone-800 border-b pb-2">Général & Accueil</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField 
            label="Nom de l'entreprise" 
            value={localConfig.name} 
            onChange={v => setLocalConfig({...localConfig, name: v})} 
          />
          <InputField 
            label="Slogan / Titre Accueil" 
            value={localConfig.tagline} 
            onChange={v => setLocalConfig({...localConfig, tagline: v})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Description Accueil</label>
          <div className="bg-white rounded-lg">
            <ReactQuill 
              theme="snow"
              value={localConfig.description} 
              onChange={v => setLocalConfig({...localConfig, description: v})}
              className="bg-white rounded-lg"
            />
          </div>
          <p className="text-xs text-stone-500 mt-2">Vous pouvez mettre en gras, en italique, ou souligner le texte principal.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Image Principale (Lien Web URL)</label>
          <input
            type="url"
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            value={localConfig.heroImageUrl || ''}
            onChange={e => setLocalConfig({...localConfig, heroImageUrl: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Galerie Photos Accueil (1 lien par ligne, max 6)</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            rows={4}
            placeholder="https://..."
            value={localConfig.homeGalleryUrls || ''}
            onChange={e => setLocalConfig({...localConfig, homeGalleryUrls: e.target.value})}
          />
          <p className="text-xs text-stone-500 mt-1">S'afficheront sous l'en-tête de la page d'accueil. Assurez-vous que le lien se termine bien par .jpg ou .png</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Adresse" value={localConfig.address} onChange={v => setLocalConfig({...localConfig, address: v})} />
          <InputField label="Téléphone" value={localConfig.phone} onChange={v => setLocalConfig({...localConfig, phone: v})} />
          <InputField label="Email" value={localConfig.email} onChange={v => setLocalConfig({...localConfig, email: v})} />
          <InputField label="Formspree ID (Contact)" value={localConfig.formspreeId} onChange={v => setLocalConfig({...localConfig, formspreeId: v})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Horaires (Pied de page)</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            value={localConfig.hours}
            onChange={e => setLocalConfig({...localConfig, hours: e.target.value})}
          />
        </div>
      </div>

      {/* Section Toilettage */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-stone-800 border-b pb-2">Page Toilettage</h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Sous-titre / Introduction</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={2}
            value={localConfig.groomingSubtitle}
            onChange={e => setLocalConfig({...localConfig, groomingSubtitle: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Photos Avant / Après (1 lien d'image par ligne, max 6)</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            rows={4}
            placeholder="https://..."
            value={localConfig.groomingGalleryUrls || ''}
            onChange={e => setLocalConfig({...localConfig, groomingGalleryUrls: e.target.value})}
          />
          <p className="text-xs text-stone-500 mt-1">Collez ici les adresses (URL) de vos photos. Assurez-vous que le lien se termine bien par .jpg ou .png</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Titre section 'Prestations'" value={localConfig.groomingServicesTitle} onChange={v => setLocalConfig({...localConfig, groomingServicesTitle: v})} />
          <InputField label="Titre section 'Tarifs'" value={localConfig.groomingPricingTitle} onChange={v => setLocalConfig({...localConfig, groomingPricingTitle: v})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Liste des prestations (1 par ligne)</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={6}
            value={localConfig.groomingServicesList || ''}
            onChange={e => setLocalConfig({...localConfig, groomingServicesList: e.target.value})}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Note (bas des prestations)</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
              rows={2}
              value={localConfig.groomingServicesNote}
              onChange={e => setLocalConfig({...localConfig, groomingServicesNote: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Note (haut des tarifs)</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
              rows={2}
              value={localConfig.groomingPricingNote}
              onChange={e => setLocalConfig({...localConfig, groomingPricingNote: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Section Pension */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-stone-800 border-b pb-2">Page Pension</h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Sous-titre / Introduction</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={2}
            value={localConfig.boardingSubtitle}
            onChange={e => setLocalConfig({...localConfig, boardingSubtitle: e.target.value})}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Titre section confort" value={localConfig.boardingComfortTitle} onChange={v => setLocalConfig({...localConfig, boardingComfortTitle: v})} />
          <InputField label="Titre section tarifs" value={localConfig.boardingPricingTitle} onChange={v => setLocalConfig({...localConfig, boardingPricingTitle: v})} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Note sous les tarifs" value={localConfig.boardingPricingNote} onChange={v => setLocalConfig({...localConfig, boardingPricingNote: v})} />
          <InputField label="Titre Alerte / Info Importante" value={localConfig.boardingAlertTitle} onChange={v => setLocalConfig({...localConfig, boardingAlertTitle: v})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Message Info Importante</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={2}
            value={localConfig.boardingAlertContent}
            onChange={e => setLocalConfig({...localConfig, boardingAlertContent: e.target.value})}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Titre bloc 'Conditions'" value={localConfig.boardingConditionsTitle} onChange={v => setLocalConfig({...localConfig, boardingConditionsTitle: v})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Conditions d'admission (1 par ligne)</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
            rows={5}
            value={localConfig.boardingConditionsContent}
            onChange={e => setLocalConfig({...localConfig, boardingConditionsContent: e.target.value})}
          />
        </div>
      </div>

      <button type="submit" className="sticky bottom-4 flex items-center px-6 py-3 bg-stone-900 text-white rounded-xl shadow-lg hover:bg-stone-800 transition-colors w-full justify-center">
        <Save className="w-5 h-5 mr-2" />
        Sauvegarder tous les textes
      </button>
    </form>
  );
}

function ServicesConfig({ services }: { services: Service[] }) {
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'grooming' | 'boarding'>('grooming');

  const addService = async () => {
    if (!newTitle) return;
    const path = 'services';
    try {
      await addDoc(collection(db, path), {
        title: newTitle,
        price: newPrice,
        category: newCategory,
        order: services.length + 1
      });
      setNewTitle('');
      setNewPrice('');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const deleteService = async (id: string) => {
    const path = `services/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4">Ajouter un service</h3>
        <div className="flex flex-wrap gap-4">
          <input className="px-4 py-2 border rounded-lg" placeholder="Titre (ex: Petit chien)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <input className="px-4 py-2 border rounded-lg w-32" placeholder="Prix (ex: 35€)" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
          <select className="px-4 py-2 border rounded-lg" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
            <option value="grooming">Toilettage</option>
            <option value="boarding">Pension</option>
          </select>
          <button onClick={addService} className="p-2 bg-stone-900 text-white rounded-lg"><Plus className="w-6 h-6" /></button>
        </div>
      </div>
      
      <div className="space-y-2">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
            <div>
              <span className="font-medium">{s.title}</span>
              <span className="ml-4 text-stone-500">{s.price}</span>
              <span className="ml-2 text-xs bg-stone-200 px-2 py-1 rounded capitalize">{s.category}</span>
            </div>
            <button onClick={() => deleteService(s.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardingConfig({ features }: { features: BoardingFeature[] }) {
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
  
    const addFeature = async () => {
      if (!newTitle) return;
      const path = 'boarding_features';
      try {
        await addDoc(collection(db, path), {
          title: newTitle,
          description: newDesc,
          order: features.length + 1
        });
        setNewTitle('');
        setNewDesc('');
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    };
  
    const deleteFeature = async (id: string) => {
      const path = `boarding_features/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, path);
      }
    };
  
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Ajouter un point fort pension</h3>
          <div className="space-y-4">
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="Titre (ex: Box individuels)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <button onClick={addFeature} className="flex items-center px-4 py-2 bg-stone-900 text-white rounded-lg"><Plus className="w-5 h-5 mr-1" /> Ajouter</button>
          </div>
        </div>
        
        <div className="space-y-2">
          {features.map(f => (
            <div key={f.id} className="p-4 bg-stone-50 rounded-xl flex justify-between items-start">
              <div>
                <h4 className="font-bold">{f.title}</h4>
                <p className="text-sm text-stone-600">{f.description}</p>
              </div>
              <button onClick={() => deleteFeature(f.id)} className="text-red-500 hover:text-red-700 ml-4">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
}

function LinksConfig({ links }: { links: ExternalLink[] }) {
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');
  
    const addLink = async () => {
      if (!newLabel || !newUrl) return;
      const path = 'links';
      try {
        await addDoc(collection(db, path), {
          label: newLabel,
          url: newUrl,
          order: links.length + 1
        });
        setNewLabel('');
        setNewUrl('');
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    };
  
    const deleteLink = async (id: string) => {
      const path = `links/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, path);
      }
    };
  
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Ajouter un bouton de lien externe</h3>
          <div className="flex flex-wrap gap-4">
            <input className="px-4 py-2 border rounded-lg flex-1" placeholder="Texte du bouton (ex: Ma future pension)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
            <input className="px-4 py-2 border rounded-lg flex-1" placeholder="URL (ex: https://...)" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
            <button onClick={addLink} className="p-2 bg-stone-900 text-white rounded-lg"><Plus className="w-6 h-6" /></button>
          </div>
        </div>
        
        <div className="space-y-2">
          {links.map(l => (
            <div key={l.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div>
                <span className="font-medium">{l.label}</span>
                <span className="ml-4 text-stone-500 text-sm italic">{l.url}</span>
              </div>
              <button onClick={() => deleteLink(l.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <input
        type="text"
        className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
