import type { Express, Request, Response } from "express";
import multer from "multer";
import { Client } from "@replit/object-storage";
import OpenAI from "openai";
import { chatStorage } from "./storage";

// --- Configuration ---

// 1. Setup Replit Object Storage
const storage = new Client();

// 2. Setup Multer for file uploads (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// 3. Setup OpenAI Helper
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openai;
}

// --- Routes Registration ---

export function registerChatRoutes(app: Express): void {

  // ==========================================
  //  Profile & Image Routes
  // ==========================================

  // Upload Profile Picture & Update Data
  app.post("/api/update-profile", upload.single("avatar"), async (req: Request, res: Response) => {
    try {
      const { username, bio } = req.body;
      let imageFilename = undefined;

      // Handle Image Upload
      if (req.file) {
        // Create unique filename: timestamp-originalname
        imageFilename = `avatars/${Date.now()}-${req.file.originalname}`;

        // Upload to Replit Object Storage
        const { ok, error } = await storage.uploadFromBytes(imageFilename, req.file.buffer);

        if (!ok) {
          console.error("Upload failed:", error);
          return res.status(500).json({ message: "Failed to upload image" });
        }
      }

      // TODO: Update your User Database here using 'username', 'bio', and 'imageFilename'
      // Example: await userStorage.updateUser(userId, { username, bio, image: imageFilename });

      res.json({ 
        success: true, 
        message: "Profile updated successfully", 
        image: imageFilename 
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Serve Profile Images
  app.get("/api/avatar/:filename", async (req: Request, res: Response) => {
    try {
      const filename = `avatars/${req.params.filename}`;
      const { ok, value, error } = await storage.downloadAsBytes(filename);

      if (!ok) {
        return res.status(404).send("Image not found");
      }

      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(value));
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).send("Error fetching image");
    }
  });

  // ==========================================
  //  Chat & Conversation Routes
  // ==========================================

  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;

      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const client = getOpenAIClient();
      if (!client) {
        res.write(`data: ${JSON.stringify({ error: "OpenAI API key not configured" })}\n\n`);
        res.end();
        return;
      }

      // Stream response from OpenAI
      const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant message
      await chatStorage.createMessage(conversationId, "assistant", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}