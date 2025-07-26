import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { insertContactSchema, insertUserSchema, insertPostSchema, insertSiteSettingsSchema, insertPageSchema, insertPageComponentSchema, insertMenuItemSchema, insertFormSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateToken, requireAdmin, hashPassword, comparePassword, type AuthenticatedRequest } from "./auth";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer"; // <-- Added for email functionality

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

      // ===== EMAIL SENDING ONLY =====
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CONTACT_GMAIL_USER || 'YOUR_GMAIL_USERNAME@gmail.com',
          pass: process.env.CONTACT_GMAIL_PASS || 'YOUR_GMAIL_APP_PASSWORD'
        }
      });
      const mailOptions = {
        from: contactData.email,
        to: 'schl.soumyadipkarforma@gmail.com',
        subject: `Contact Form: ${contactData.subject}`,
        text: `
          Name: ${contactData.firstName} ${contactData.lastName}
          Email: ${contactData.email}
          Phone: ${contactData.phone}
          Message: ${contactData.message}
        `
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error("Failed to send contact form email:", err);
        return res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
      }
      // ===== END EMAIL SENDING ONLY =====

      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // ... rest of your routes remain unchanged ...

  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getActiveNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch news" });
    }
  });

  // [rest of file unchanged...]
  const httpServer = createServer(app);
  return httpServer;
}
