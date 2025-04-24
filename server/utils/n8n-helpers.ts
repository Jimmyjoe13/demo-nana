
// Utilitaires pour l'intégration avec N8N

/**
 * Parcourt récursivement un objet pour trouver une propriété spécifique
 * @param obj Objet à parcourir
 * @param key Clé à rechercher
 * @returns Valeur trouvée ou undefined
 */
export function findDeepProperty(obj: any, key: string): any {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  
  if (obj[key] !== undefined) {
    return obj[key];
  }
  
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object') {
      const found = findDeepProperty(obj[prop], key);
      if (found !== undefined) {
        return found;
      }
    }
  }
  
  return undefined;
}

/**
 * Extrait la réponse de l'agent IA depuis différentes structures de réponse N8N
 * @param data Données de réponse de N8N
 * @returns Texte de réponse extrait
 */
export function extractAgentResponse(data: any): string {
  if (!data) {
    return "Aucune réponse reçue du service.";
  }
  
  // Structures de réponse connues de N8N
  const possiblePaths = [
    'output.output',
    'output',
    'response',
    'result.output',
    'result',
    'data.output',
    'data',
    'aiOutput',
    'content'
  ];
  
  // Essayer chaque chemin possible
  for (const path of possiblePaths) {
    const keys = path.split('.');
    let value = data;
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value !== undefined && typeof value === 'string') {
      return value;
    }
  }
  
  // Recherche récursive si les chemins connus échouent
  const foundOutput = findDeepProperty(data, 'output') || 
                     findDeepProperty(data, 'response') || 
                     findDeepProperty(data, 'content');
  
  if (foundOutput && typeof foundOutput === 'string') {
    return foundOutput;
  }
  
  // Si c'est une chaîne, la retourner directement
  if (typeof data === 'string') {
    return data;
  }
  
  return "Je n'ai pas pu extraire une réponse valide de l'agent IA. Format de réponse non reconnu.";
}
