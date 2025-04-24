
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Stockage des jetons par utilisateur (en mémoire pour démo - utiliser une BD en production)
const tokenStore = new Map<string, any>();


// Portée des permissions requises
const SCOPES_EMAIL = [
  'https://www.googleapis.com/auth/gmail.send',
];
const SCOPES_CALENDAR = [
  'https://www.googleapis.com/auth/calendar.readonly',
];

export const googleService = {
  getAuthUrl(scopes: string[]) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  },

  async getTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  },
  async setTokens(sessionId: string, tokens: any) {
    tokenStore.set(sessionId, tokens);
  },
  getTokensFromStore(sessionId: string): any | undefined {
    return tokenStore.get(sessionId);
  }
};


/**
 * Récupère le client OAuth2 avec le jeton d'accès pour un utilisateur
 */
export function getAuthenticatedClient(sessionId: string, scopes: string[]): OAuth2Client | null {
  const tokens = tokenStore.get(sessionId);

  if (!tokens) {
    return null;
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);

  return oauth2Client;
}


/**
 * Récupère l'objet Gmail pour un utilisateur authentifié
 */
export function getGmailService(sessionId: string) {
  const auth = getAuthenticatedClient(sessionId, SCOPES_EMAIL);
  if (!auth) {
    throw new Error('Utilisateur non authentifié pour Gmail');
  }

  return google.gmail({ version: 'v1', auth });
}

/**
 * Récupère l'objet Calendar pour un utilisateur authentifié
 */
export function getCalendarService(sessionId: string) {
  const auth = getAuthenticatedClient(sessionId, SCOPES_CALENDAR);
  if (!auth) {
    throw new Error('Utilisateur non authentifié pour Google Calendar');
  }

  return google.calendar({ version: 'v3', auth });
}

/**
 * Génère l'URL d'authentification Google
 */
export function getAuthUrl(sessionId: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [...SCOPES_EMAIL, ...SCOPES_CALENDAR],
    state: sessionId
  });
}

/**
 * Obtient un jeton à partir du code d'autorisation
 */
export async function getTokenFromCode(code: string, sessionId: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    // Stocker les jetons pour cette session
    tokenStore.set(sessionId, tokens);
    return tokens;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du jeton:', error);
    throw error;
  }
}

/**
 * Vérifie si l'utilisateur est connecté à Gmail
 */
export function isGmailConnected(sessionId: string): boolean {
  const tokens = tokenStore.get(sessionId);
  return !!tokens;
}

/**
 * Vérifie si l'utilisateur est connecté à Google Calendar
 */
export function isCalendarConnected(sessionId: string): boolean {
  const tokens = tokenStore.get(sessionId);
  return !!tokens;
}

/**
 * Déconnecte l'utilisateur de Google
 */
export function disconnectGoogle(sessionId: string): void {
  tokenStore.delete(sessionId);
}
