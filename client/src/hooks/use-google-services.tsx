import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { ServiceStatus } from "@shared/services";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GoogleServicesContextType {
  status: ServiceStatus;
  isLoading: boolean;
  connectGoogle: () => Promise<void>;
  disconnectAll: () => Promise<void>;
}

const GoogleServicesContext = createContext<GoogleServicesContextType | undefined>(undefined);

export function GoogleServicesProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ServiceStatus>({
    gmail: false,
    calendar: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Vérifier l'état des connexions au chargement
  useEffect(() => {
    checkConnectionStatus();

    // Vérifier aussi si nous revenons d'une authentification
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get('auth');
    
    if (authResult === 'success') {
      toast({
        title: "Connexion réussie",
        description: "Vos comptes Google ont été connectés avec succès",
      });
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Revérifier le statut
      checkConnectionStatus();
    } else if (authResult === 'error') {
      toast({
        title: "Erreur de connexion",
        description: "La connexion à vos comptes Google a échoué",
        variant: "destructive"
      });
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await apiRequest("GET", "/api/services/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Erreur lors de la vérification du statut des services:", error);
    }
  };

  const connectGoogle = async () => {
    try {
      setIsLoading(true);
      // Générer un ID de session unique si nécessaire
      const sessionId = localStorage.getItem('sessionId') || uuidv4();
      localStorage.setItem('sessionId', sessionId);

      // Demander l'URL d'authentification
      const response = await apiRequest("POST", "/api/auth/google", { 
        service: "google", 
        sessionId 
      });
      const data = await response.json();

      // Rediriger vers l'URL d'authentification
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL d'authentification non reçue");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion à Google:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter aux services Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectAll = async () => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/services/disconnect", { 
        service: "all" 
      });
      
      // Mettre à jour l'état local
      setStatus({
        gmail: false,
        calendar: false
      });
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes déconnecté de tous les services Google"
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Impossible de se déconnecter des services Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleServicesContext.Provider value={{
      status,
      isLoading,
      connectGoogle,
      disconnectAll
    }}>
      {children}
    </GoogleServicesContext.Provider>
  );
}

export function useGoogleServices() {
  const context = useContext(GoogleServicesContext);
  if (context === undefined) {
    throw new Error("useGoogleServices must be used within a GoogleServicesProvider");
  }
  return context;
}