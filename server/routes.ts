import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { 
  chatRequestSchema, 
  chatResponseSchema,
  messageSchema,
  conversationSchema,
} from "@shared/schema";
import { 
  authRequestSchema, 
  authCallbackSchema,
  serviceStatusSchema,
  connectionUpdateSchema
} from "@shared/services";
import { generateChatResponse } from "./openai";
import { defaultConfig } from "./config";
import { 
  getAuthUrl, 
  getTokenFromCode, 
  isGmailConnected, 
  isCalendarConnected,
  disconnectGoogle
} from "./services/google";
import { sendToWorkflow, prepareMessagesForWebhook } from "./services/webhook";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for chat - modifié pour utiliser le webhook N8N
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate request
      const validatedRequest = chatRequestSchema.parse(req.body);
      const { message, conversationId, config } = validatedRequest;

      // Vérifier si le chat est activé via localStorage
      // Avant, cette vérification était faite côté client seulement
      
      // Récupérer le sessionId depuis la session ou utiliser l'ID de conversation
      const sessionId = req.session?.id || conversationId || uuidv4();

      // Get existing conversation or create new one
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation) {
          return res.status(404).json({ error: "Conversation not found" });
        }
      } else {
        // Create a new conversation
        conversation = {
          id: sessionId,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }

      // Create user message
      const userMessage = {
        id: uuidv4(),
        role: "user" as const,
        content: message,
        timestamp: Date.now()
      };

      // Add user message to conversation
      conversation.messages.push(userMessage);
      conversation.updatedAt = Date.now();

      try {
        // Envoyer au webhook N8N au lieu d'OpenAI directement
        const assistantResponseContent = await sendToWorkflow(
          message,
          sessionId,
          req.session?.userEmail
        );

        // Si le webhook a renvoyé FALLBACK_TO_OPENAI, on utilise OpenAI directement
        if (assistantResponseContent === "FALLBACK_TO_OPENAI") {
          console.log("Utilisation d'OpenAI comme fallback");
          const assistantResponse = await generateChatResponse(conversation.messages, config);
          
          // Create assistant message
          const assistantMessage = {
            id: uuidv4(),
            role: "assistant" as const,
            content: assistantResponse,
            timestamp: Date.now()
          };

          // Add assistant message to conversation
          conversation.messages.push(assistantMessage);
          conversation.updatedAt = Date.now();

          // Save conversation
          await storage.saveConversation(conversation);

          // Return response
          return res.status(200).json({
            message: assistantMessage,
            conversation: conversation
          });
        }

        // Create assistant message
        const assistantMessage = {
          id: uuidv4(),
          role: "assistant" as const,
          content: assistantResponseContent,
          timestamp: Date.now()
        };

        // Add assistant message to conversation
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = Date.now();

        // Save conversation
        await storage.saveConversation(conversation);

        // Return response
        return res.status(200).json({
          message: assistantMessage,
          conversation: conversation
        });
      } catch (webhookError) {
        console.error("Error with webhook, falling back to OpenAI:", webhookError);
        
        // En cas d'erreur avec le webhook, on utilise OpenAI directement comme fallback
        const assistantResponse = await generateChatResponse(conversation.messages, config);

        // Create assistant message
        const assistantMessage = {
          id: uuidv4(),
          role: "assistant" as const,
          content: assistantResponse,
          timestamp: Date.now()
        };

        // Add assistant message to conversation
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = Date.now();

        // Save conversation
        await storage.saveConversation(conversation);

        // Return response
        return res.status(200).json({
          message: assistantMessage,
          conversation: conversation
        });
      }
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // API endpoint to get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      return res.status(200).json(conversation);
    } catch (error) {
      console.error("Error getting conversation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // API endpoint to get system configuration
  app.get("/api/config", (_req, res) => {
    return res.status(200).json(defaultConfig);
  });

  // === Nouveaux endpoints pour l'authentification et les services ===

  // Obtenir l'URL d'authentification Google
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { sessionId } = authRequestSchema.parse(req.body);
      
      // Utiliser le sessionId directement plutôt que de modifier req.session.id
      // qui est une propriété en lecture seule
      const authUrl = getAuthUrl(sessionId);
      
      // Stocker le sessionId dans un autre attribut de la session
      if (req.session) {
        req.session.userSessionId = sessionId;
      }
      
      return res.status(200).json({ url: authUrl });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Callback pour l'authentification Google
  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code, state: sessionId } = authCallbackSchema.parse(req.query);
      
      // Obtenir le jeton à partir du code
      const tokens = await getTokenFromCode(code, sessionId);
      
      // Stocker les informations utilisateur dans la session
      if (req.session) {
        req.session.userSessionId = sessionId;
        req.session.userEmail = tokens.id_token ? 
          JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()).email : 
          'unknown@email.com';
      }
      
      // Rediriger vers l'application avec statut de succès
      return res.redirect('/?auth=success');
    } catch (error) {
      console.error("Error in Google auth callback:", error);
      // Rediriger vers l'application avec statut d'erreur
      return res.redirect('/?auth=error');
    }
  });

  // Vérifier l'état de connexion des services
  app.get("/api/services/status", (req, res) => {
    try {
      const sessionId = req.session?.userSessionId || '';
      
      const status = {
        gmail: isGmailConnected(sessionId),
        calendar: isCalendarConnected(sessionId)
      };
      
      return res.status(200).json(status);
    } catch (error) {
      console.error("Error checking service status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Déconnecter des services
  app.post("/api/services/disconnect", (req, res) => {
    try {
      const { service } = connectionUpdateSchema.parse(req.body);
      const sessionId = req.session?.userSessionId || '';
      
      if (!sessionId) {
        return res.status(400).json({ error: "No session ID available" });
      }
      
      if (service === 'all') {
        disconnectGoogle(sessionId);
        if (req.session) {
          req.session.userEmail = undefined;
        }
        return res.status(200).json({ success: true });
      }
      
      return res.status(400).json({ error: "Invalid service type" });
    } catch (error) {
      console.error("Error disconnecting service:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
