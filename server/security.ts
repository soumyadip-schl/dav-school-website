import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import cors from "cors";
import type { Express, Request, Response, NextFunction } from "express";
import ExpressBrute from "express-brute";
import PostgreSQLStore from "express-brute-postgres";
import { pool } from "./db";
import crypto from "crypto";

// Security Headers Configuration
export function setupSecurityHeaders(app: Express) {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  }));

  // CORS Configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
  }));

  // Additional security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
}

// Rate Limiting Configuration
export function setupRateLimiting(app: Express) {
  // General rate limiting
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60 * 1000
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests from this IP, please try again later.'
      });
    }
  });

  // Strict rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
      error: 'Too many login attempts, please try again later.',
      retryAfter: 15 * 60 * 1000
    },
    skipSuccessfulRequests: true,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many login attempts',
        message: 'Account temporarily locked due to multiple failed attempts.'
      });
    }
  });

  // Apply rate limiting
  app.use('/api/', generalLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/admin/', authLimiter);
}

// Brute Force Protection
export function setupBruteForceProtection(app: Express) {
  const store = new PostgreSQLStore({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    tablename: 'brute_force_store'
  });

  const bruteforce = new ExpressBrute(store, {
    freeRetries: 3,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour
    lifetime: 24 * 60 * 60, // 24 hours
    failCallback: (req, res, next, nextValidRequestDate) => {
      res.status(429).json({
        error: 'Too many failed attempts',
        message: `Account locked until ${nextValidRequestDate}`,
        nextValidRequestDate: nextValidRequestDate
      });
    }
  });

  // Apply brute force protection to sensitive endpoints
  app.use('/api/auth/login', bruteforce.prevent);
  app.use('/api/admin/', bruteforce.prevent);
}

// Input Validation Rules
export const validateLoginInput = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
];

export const validatePostInput = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .trim()
    .escape()
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .isLength({ min: 1, max: 10000 })
    .trim()
    .withMessage('Content must be between 1 and 10000 characters'),
  body('category')
    .isIn(['general', 'sports', 'cultural', 'labs', 'academics', 'events'])
    .withMessage('Invalid category'),
];

export const validateContactInput = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape()
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Valid phone number is required'),
  body('message')
    .isLength({ min: 10, max: 1000 })
    .trim()
    .withMessage('Message must be between 10 and 1000 characters'),
];

export const validateSettingsInput = [
  body('*.key')
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('Setting key contains invalid characters'),
  body('*.value')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .withMessage('Setting value must be between 1 and 1000 characters'),
  body('*.category')
    .isIn(['theme', 'contact', 'content', 'social'])
    .withMessage('Invalid setting category'),
];

// Validation Error Handler
export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
}

// SQL Injection Protection
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['"\\;]/g, '') // Remove quotes and semicolons
    .replace(/(--)|(\/\*)|(\*\/)/g, '') // Remove SQL comments
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|EXECUTE|UNION|SELECT)\b/gi, '') // Remove dangerous SQL keywords
    .trim();
}

// XSS Protection
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Session Security
export function generateSecureSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
}

// File Upload Security
export function validateFileUpload(file: any): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.mimetype)) {
    return false;
  }
  
  if (file.size > maxSize) {
    return false;
  }
  
  // Check file signature (magic bytes)
  const fileSignatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46]
  };
  
  // Additional validation would require reading file buffer
  return true;
}

// Database Security
export function hashSensitiveData(data: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyHashedData(data: string, hashedData: string): boolean {
  const [salt, hash] = hashedData.split(':');
  const hashToVerify = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashToVerify, 'hex'));
}

// Security Monitoring
export function logSecurityEvent(event: string, details: any, req: Request) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method
  };
  
  console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
  
  // In production, you would send this to a security monitoring service
  // or store in a separate security log database
}

// Request Sanitization Middleware
export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
  // Sanitize query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = sanitizeInput(req.query[key] as string);
    }
  }
  
  // Sanitize body parameters (for non-file uploads)
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  
  next();
}

// Security Response Headers
export function setSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
}