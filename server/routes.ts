import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema, insertPostSchema, insertSiteSettingsSchema, insertPageSchema, insertPageComponentSchema, insertMenuItemSchema, insertFormSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateToken, requireAdmin, hashPassword, comparePassword, type AuthenticatedRequest } from "./auth";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, message: "Contact form submitted successfully", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Get active news
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getActiveNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch news" });
    }
  });

  // Get active events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
  });

  // Get active testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Create session
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const session = await storage.createSession({ userId: user.id, expiresAt });

      res.json({
        success: true,
        message: "Login successful",
        token: session.id,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.json({ success: true, message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      user: req.user
    });
  });

  // Admin routes
  app.post("/api/admin/users", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      userData.password = await hashPassword(userData.password);
      
      const user = await storage.createUser(userData);
      
      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create user" });
      }
    }
  });

  // Posts routes
  app.post("/api/posts", authenticateToken, requireAdmin, upload.array('images', 10), async (req: AuthenticatedRequest, res) => {
    try {
      const { title, content, category } = req.body;
      const files = req.files as Express.Multer.File[];
      
      // Process uploaded images
      const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      const postData = {
        title,
        content,
        category,
        images: imageUrls,
        active: true
      };
      
      const post = await storage.createPost(postData, req.user!.id);
      
      res.json({
        success: true,
        message: "Post created successfully",
        post
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create post" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getActivePosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const posts = await storage.getPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
  });

  // Site settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const settings = await storage.getSiteSettingsByCategory(category);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const settingsData = req.body;
      
      // Validate each setting
      const validatedSettings = settingsData.map((setting: any) => 
        insertSiteSettingsSchema.parse(setting)
      );
      
      await storage.updateSiteSettings(validatedSettings);
      
      res.json({
        success: true,
        message: "Settings updated successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to update settings" });
      }
    }
  });

  // Page management routes
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch pages" });
    }
  });

  app.post("/api/pages", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const pageData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(pageData);
      res.json({ success: true, page });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create page" });
    }
  });

  app.put("/api/pages/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const pageData = insertPageSchema.parse(req.body);
      const page = await storage.updatePage(parseInt(id), pageData);
      res.json({ success: true, page });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update page" });
    }
  });

  app.delete("/api/pages/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deletePage(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete page" });
    }
  });

  // Page components routes
  app.get("/api/pages/:id/components", async (req, res) => {
    try {
      const { id } = req.params;
      const components = await storage.getPageComponents(parseInt(id));
      res.json(components);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch page components" });
    }
  });

  app.post("/api/page-components", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const componentData = insertPageComponentSchema.parse(req.body);
      const component = await storage.createPageComponent(componentData);
      res.json({ success: true, component });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create component" });
    }
  });

  app.put("/api/page-components/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const componentData = insertPageComponentSchema.parse(req.body);
      const component = await storage.updatePageComponent(parseInt(id), componentData);
      res.json({ success: true, component });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update component" });
    }
  });

  app.delete("/api/page-components/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deletePageComponent(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete component" });
    }
  });

  // Menu management routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getVisibleMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch menu items" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
