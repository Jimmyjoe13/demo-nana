import { z } from 'zod';

// Schema pour l'état de connexion des services
export const serviceStatusSchema = z.object({
  gmail: z.boolean().default(false),
  calendar: z.boolean().default(false)
});

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;

// Schema pour les requêtes d'authentification
export const authRequestSchema = z.object({
  service: z.enum(['google']),
  sessionId: z.string()
});

export type AuthRequest = z.infer<typeof authRequestSchema>;

// Schema pour les réponses d'authentification
export const authResponseSchema = z.object({
  url: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// Schema pour les callbacks d'authentification
export const authCallbackSchema = z.object({
  code: z.string(),
  state: z.string(), // sessionId
  scope: z.string().optional()
});

export type AuthCallback = z.infer<typeof authCallbackSchema>;

// Schema pour les mises à jour de l'état de connexion
export const connectionUpdateSchema = z.object({
  service: z.enum(['gmail', 'calendar', 'all']),
  connected: z.boolean(),
  email: z.string().optional()
});

export type ConnectionUpdate = z.infer<typeof connectionUpdateSchema>;