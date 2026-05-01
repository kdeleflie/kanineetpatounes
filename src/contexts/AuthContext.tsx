import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        const hostname = window.location.hostname;
        const projectId = "gen-lang-client-0650807371";
        const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;
        
        alert(
          `Erreur d'authentification : Domaine non autorisé.\n\n` +
          `Le domaine "${hostname}" n'est pas autorisé dans votre configuration Firebase.\n\n` +
          `Pour corriger cela :\n` +
          `1. Allez sur la console Firebase : ${consoleUrl}\n` +
          `2. Dans l'onglet "Domaines autorisés", ajoutez "${hostname}"\n\n` +
          `Project ID : ${projectId}`
        );
      } else {
        alert("Une erreur est survenue lors de la connexion : " + error.message);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = !!user && [
    "fdeleflie@gmail.com",
    "kdeleflie@gmail.com",
    "kanineetpatounes@gmail.com"
  ].includes(user.email?.toLowerCase() || "");

  useEffect(() => {
    if (user) {
      console.log("Auth Status - Email:", user.email, "Is Admin:", isAdmin);
    }
  }, [user, isAdmin]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
