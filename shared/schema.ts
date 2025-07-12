import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(), // "admin" or "user"
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  icon: text("icon").notNull(),
  active: boolean("active").default(true),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  message: text("message").notNull(),
  image: text("image"),
  active: boolean("active").default(true),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: text("images").array(), // Array of image URLs
  category: text("category").notNull(), // "sports", "cultural", "labs", "general"
  authorId: integer("author_id").references(() => users.id),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull(), // "theme", "contact", "content", "social"
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dynamic pages management
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  layout: text("layout").notNull().default("default"), // "default", "fullwidth", "sidebar"
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dynamic components for pages
export const pageComponents = pgTable("page_components", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pages.id, { onDelete: "cascade" }),
  componentType: text("component_type").notNull(), // "hero", "text", "image", "gallery", "form", "button", "video"
  componentData: text("component_data").notNull(), // JSON string with component configuration
  order: integer("order").default(0),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Navigation menu management
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  parentId: integer("parent_id"),
  order: integer("order").default(0),
  isExternal: boolean("is_external").default(false),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Form builder
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fields: text("fields").notNull(), // JSON string with form fields configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Form submissions
export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").references(() => forms.id),
  data: text("data").notNull(), // JSON string with submitted data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  content: true,
  images: true,
  category: true,
  active: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  expiresAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  category: true,
});

export const insertPageSchema = createInsertSchema(pages).pick({
  title: true,
  slug: true,
  content: true,
  layout: true,
  metaTitle: true,
  metaDescription: true,
  isPublished: true,
  order: true,
});

export const insertPageComponentSchema = createInsertSchema(pageComponents).pick({
  pageId: true,
  componentType: true,
  componentData: true,
  order: true,
  isVisible: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  title: true,
  url: true,
  parentId: true,
  order: true,
  isExternal: true,
  isVisible: true,
});

export const insertFormSchema = createInsertSchema(forms).pick({
  name: true,
  title: true,
  description: true,
  fields: true,
  isActive: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).pick({
  formId: true,
  data: true,
  ipAddress: true,
  userAgent: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  content: true,
  active: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  icon: true,
  active: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  role: true,
  message: true,
  image: true,
  active: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPageComponent = z.infer<typeof insertPageComponentSchema>;
export type PageComponent = typeof pageComponents.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof forms.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
