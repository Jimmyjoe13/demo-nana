import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message types
export const messageRoleSchema = z.enum(["user", "assistant", "system"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export const messageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  timestamp: z.number(),
});

export const createMessageSchema = messageSchema.omit({ id: true });
export type Message = z.infer<typeof messageSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;

// Conversation types
export const conversationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  messages: z.array(messageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const createConversationSchema = conversationSchema.omit({ id: true });
export type Conversation = z.infer<typeof conversationSchema>;
export type CreateConversation = z.infer<typeof createConversationSchema>;

// Chat configuration types
export const modelSchema = z.string();
export type Model = z.infer<typeof modelSchema>;

export const chatConfigSchema = z.object({
  apiKey: z.string().optional(),
  model: modelSchema.default("gpt-3.5-turbo"),
  temperature: z.number().min(0.1).max(1.5).default(1.0),
  systemPrompt: z.string().default("default"),
  customPrompt: z.string().optional(),
});
export type ChatConfig = z.infer<typeof chatConfigSchema>;

// Chat request and response types
export const chatRequestSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
  config: chatConfigSchema,
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  message: messageSchema,
  conversation: conversationSchema,
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;
