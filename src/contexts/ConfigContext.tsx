import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, collection, query, orderBy, setDoc } from 'firebase/firestore';

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logoSeed: string; // Keeping for backward compatibility or future use
  heroImageUrl: string;
  homeGalleryUrls: string;
  formspreeId: string;

  // Toilettage (Grooming)
  groomingSubtitle: string;
  groomingGalleryUrls: string;
  groomingServicesList: string;
  groomingServicesTitle: string;
  groomingServicesNote: string;
  groomingPricingTitle: string;
  groomingPricingNote: string;

  // Pension (Boarding)
  boardingSubtitle: string;
  boardingComfortTitle: string;
  boardingPricingTitle: string;
  boardingPricingNote: string;
  boardingAlertTitle: string;
  boardingAlertContent: string;
  boardingConditionsTitle: string;
  boardingConditionsContent: string;
}

export interface Service {
  id: string;
  title: string;
  price: string;
  category: 'grooming' | 'boarding';
  order: number;
}

export interface BoardingFeature {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface ConfigContextType {
  config: SiteConfig | null;
  services: Service[];
  boardingFeatures: BoardingFeature[];
  links: ExternalLink[];
  loading: boolean;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const DEFAULT_CONFIG: SiteConfig = {
  name: "Ka'nine et Patounes",
  tagline: "Le bien-être de vos compagnons avant tout",
  description: "Structure familiale proposant un double service dédié au bien-être de vos compagnons.",
  address: "La Bassée (59)",
  phone: "06 XX XX XX XX",
  email: "kdeleflie@gmail.com",
  hours: "Sur rendez-vous uniquement.",
  logoSeed: "vibrant",
  heroImageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000",
  homeGalleryUrls: "",
  formspreeId: "xvovpznl",

  groomingSubtitle: "Nous accueillons toutes les races pour des soins adaptés et personnalisés.",
  groomingGalleryUrls: "",
  groomingServicesList: "Bain, brushing et démêlage soigneux\nTonte adaptée à la race et à la saison\nCoupe ciseaux pour une finition parfaite\nÉpilation (Trimming) pour les races à poil dur\nCoupe des griffes incluse\nNettoyage des oreilles et des yeux",
  groomingServicesTitle: "Nos Prestations",
  groomingServicesNote: "Nous utilisons des produits de haute qualité adaptés au type de poil et à la peau de votre animal.",
  groomingPricingTitle: "Tarifs Indicatifs",
  groomingPricingNote: "Les tarifs peuvent varier selon l'état du pelage et le comportement de l'animal.",

  boardingSubtitle: "Une véritable colonie de vacances pour votre chat, en toute sécurité.",
  boardingComfortTitle: "Un séjour tout confort",
  boardingPricingTitle: "Tarifs Pension",
  boardingPricingNote: "Tarifs disponibles sur demande.",
  boardingAlertTitle: "Information Importante",
  boardingAlertContent: "Pensez à réserver à l'avance pour les périodes de vacances scolaires ! Nos places sont limitées pour garantir le confort de chaque pensionnaire.",
  boardingConditionsTitle: "Conditions d'admission",
  boardingConditionsContent: "Identification par puce ou tatouage obligatoire\nVaccins à jour (Typhus, Coryza, Leucose)\nTraitement antiparasitaire (puces/tiques) récent\nCarnet de santé à fournir à l'arrivée"
};

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [boardingFeatures, setBoardingFeatures] = useState<BoardingFeature[]>([]);
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Site Config
    const configPath = 'settings/site_config';
    const unsubConfig = onSnapshot(doc(db, configPath), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data() as SiteConfig);
      } else {
        // Initialize with defaults if empty
        setConfig(DEFAULT_CONFIG);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, configPath));

    // Listen to Services
    const servicesPath = 'services';
    const unsubServices = onSnapshot(query(collection(db, servicesPath), orderBy('order')), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    }, (error) => handleFirestoreError(error, OperationType.GET, servicesPath));

    // Listen to Boarding Features
    const featuresPath = 'boarding_features';
    const unsubFeatures = onSnapshot(query(collection(db, featuresPath), orderBy('order')), (snapshot) => {
      setBoardingFeatures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BoardingFeature)));
    }, (error) => handleFirestoreError(error, OperationType.GET, featuresPath));

    // Listen to Links
    const linksPath = 'links';
    const unsubLinks = onSnapshot(query(collection(db, linksPath), orderBy('order')), (snapshot) => {
      setLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExternalLink)));
    }, (error) => handleFirestoreError(error, OperationType.GET, linksPath));

    return () => {
      unsubConfig();
      unsubServices();
      unsubFeatures();
      unsubLinks();
    };
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    const path = 'settings/site_config';
    try {
      await setDoc(doc(db, path), { ...config, ...newConfig });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <ConfigContext.Provider value={{ config, services, boardingFeatures, links, loading, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
