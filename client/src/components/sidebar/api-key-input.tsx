import { useChatConfig } from "@/hooks/use-chat-config";

// Composant masqué - NANA-AI utilise une clé API configurée côté serveur
export function ApiKeyInput() {
  // On garde le hook pour éviter les erreurs mais on ne l'affiche plus
  useChatConfig();
  
  // Retourne null = ne rien afficher
  return null;
}
