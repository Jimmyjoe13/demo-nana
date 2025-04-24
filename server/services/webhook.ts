import axios from 'axios';
import { extractAgentResponse } from '../utils/n8n-helpers';

/**
 * Prépare les messages pour le webhook
 */
export function prepareMessagesForWebhook(messages: any[], email?: string) {
  return {
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    userEmail: email || 'anonymous'
  };
}

/**
 * Envoie les messages au webhook N8N
 */
export async function sendToWorkflow(message: string, sessionId: string, userEmail?: string): Promise<string> {
  try {
    // Vérifier si l'URL du webhook est configurée
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("URL du webhook N8N non configurée, utilisation de OpenAI directement");
      console.log("Variables d'environnement disponibles:", Object.keys(process.env).filter(key => !key.includes('KEY')));
      // Plutôt que de lever une erreur, on indique qu'il faut utiliser OpenAI directement
      return "FALLBACK_TO_OPENAI";
    }

    console.log("Tentative d'envoi au webhook:", webhookUrl);

    // Vérifier que le webhook est configuré correctement (test d'accessibilité)
    try {
      const pingResponse = await axios.get(webhookUrl.split('/webhook')[0] + '/healthcheck', { timeout: 2000 });
      if (pingResponse.status !== 200) {
        console.warn("Le webhook n'est pas accessible (healthcheck failed)");
        return "FALLBACK_TO_OPENAI";
      }
    } catch (pingError) {
      console.warn("Le webhook n'est pas accessible:", pingError.message);
      return "FALLBACK_TO_OPENAI";
    }

    // Récupérer la configuration de l'agent depuis le fichier Agent_demo.json
    let agentConfig = {};
    try {
      // On importe ici la configuration de l'agent depuis le fichier
      const fs = require('fs');
      const path = require('path');
      const agentConfigPath = path.join(process.cwd(), 'attached_assets', 'Agent_d_mo.json');
      
      if (fs.existsSync(agentConfigPath)) {
        const agentConfigData = fs.readFileSync(agentConfigPath, 'utf8');
        agentConfig = JSON.parse(agentConfigData);
        console.log("Configuration de l'agent chargée avec succès");
      } else {
        console.warn("Fichier de configuration de l'agent non trouvé:", agentConfigPath);
      }
    } catch (configError) {
      console.error("Erreur lors du chargement de la configuration de l'agent:", configError);
    }

    // Préparer les données pour le webhook
    const payload = {
      message,
      sessionId,
      userEmail: userEmail || 'anonymous',
      timestamp: Date.now(),
      agentConfig // Ajouter la configuration de l'agent
    };

    // Envoyer la requête au webhook
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Timeout de 10 secondes
    });

    console.log("Réponse du webhook reçue:", response.status);

    // Vérifier la réponse
    if (response.status !== 200) {
      throw new Error(`Erreur du webhook: ${response.status} ${response.statusText}`);
    }

    // Log complet de la réponse pour débogage
    console.log("Structure complète de la réponse:", JSON.stringify(response.data, null, 2));
    
    // Utiliser l'utilitaire pour extraire la réponse de l'agent
    const agentResponse = extractAgentResponse(response.data);
    console.log("Réponse extraite de l'agent:", agentResponse);
    
    return agentResponse;
  } catch (error) {
    console.error("Erreur lors de l'envoi au webhook:", error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    // Plutôt que de propager l'erreur, on indique qu'il faut utiliser OpenAI comme fallback
    return "FALLBACK_TO_OPENAI";
  }
}