import { 
  users, 
  contacts, 
  news, 
  events, 
  testimonials,
  posts,
  sessions,
  siteSettings,
  pages,
  pageComponents,
  menuItems,
  forms,
  formSubmissions,
  type User, 
  type InsertUser,
  type Contact,
  type InsertContact,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Testimonial,
  type InsertTestimonial,
  type Post,
  type InsertPost,
  type Session,
  type InsertSession,
  type SiteSettings,
  type InsertSiteSettings,
  type Page,
  type InsertPage,
  type PageComponent,
  type InsertPageComponent,
  type MenuItem,
  type InsertMenuItem,
  type Form,
  type InsertForm,
  type FormSubmission,
  type InsertFormSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getActiveNews(): Promise<News[]>;
  getActiveEvents(): Promise<Event[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createPost(post: InsertPost, authorId: number): Promise<Post>;
  getActivePosts(): Promise<Post[]>;
  getPostsByCategory(category: string): Promise<Post[]>;
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<void>;
  getSiteSettings(): Promise<SiteSettings[]>;
  updateSiteSettings(settings: InsertSiteSettings[]): Promise<void>;
  getSiteSettingsByCategory(category: string): Promise<SiteSettings[]>;
  // Page management
  getPages(): Promise<Page[]>;
  getPublishedPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;
  // Page components
  getPageComponents(pageId: number): Promise<PageComponent[]>;
  createPageComponent(component: InsertPageComponent): Promise<PageComponent>;
  updatePageComponent(id: number, component: Partial<InsertPageComponent>): Promise<PageComponent>;
  deletePageComponent(id: number): Promise<void>;
  // Menu management
  getMenuItems(): Promise<MenuItem[]>;
  getVisibleMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;
  // Form management
  getForms(): Promise<Form[]>;
  getActiveForm(name: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  // Form submissions
  getFormSubmissions(formId: number): Promise<FormSubmission[]>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getActiveNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.active, true));
  }

  async getActiveEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.active, true));
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.active, true));
  }

  async createPost(insertPost: InsertPost, authorId: number): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values({ ...insertPost, authorId })
      .returning();
    return post;
  }

  async getActivePosts(): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.active, true));
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.category, category));
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const [session] = await db
      .insert(sessions)
      .values({ ...insertSession, id: sessionId })
      .returning();
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async deleteSession(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  async getSiteSettings(): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings);
  }

  async updateSiteSettings(settings: InsertSiteSettings[]): Promise<void> {
    for (const setting of settings) {
      await db
        .insert(siteSettings)
        .values(setting)
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: setting.value,
            updatedAt: new Date(),
          },
        });
    }
  }

  async getSiteSettingsByCategory(category: string): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings).where(eq(siteSettings.category, category));
  }

  // Page management methods
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(pages.order, pages.createdAt);
  }

  async getPublishedPages(): Promise<Page[]> {
    return await db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(pages.order, pages.createdAt);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const [page] = await db.insert(pages).values(insertPage).returning();
    return page;
  }

  async updatePage(id: number, updateData: Partial<InsertPage>): Promise<Page> {
    const [page] = await db.update(pages).set({ ...updateData, updatedAt: new Date() }).where(eq(pages.id, id)).returning();
    return page;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Page components methods
  async getPageComponents(pageId: number): Promise<PageComponent[]> {
    return await db.select().from(pageComponents).where(eq(pageComponents.pageId, pageId)).orderBy(pageComponents.order);
  }

  async createPageComponent(insertComponent: InsertPageComponent): Promise<PageComponent> {
    const [component] = await db.insert(pageComponents).values(insertComponent).returning();
    return component;
  }

  async updatePageComponent(id: number, updateData: Partial<InsertPageComponent>): Promise<PageComponent> {
    const [component] = await db.update(pageComponents).set(updateData).where(eq(pageComponents.id, id)).returning();
    return component;
  }

  async deletePageComponent(id: number): Promise<void> {
    await db.delete(pageComponents).where(eq(pageComponents.id, id));
  }

  // Menu management methods
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(menuItems.order);
  }

  async getVisibleMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.isVisible, true)).orderBy(menuItems.order);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [item] = await db.update(menuItems).set(updateData).where(eq(menuItems.id, id)).returning();
    return item;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Form management methods
  async getForms(): Promise<Form[]> {
    return await db.select().from(forms).orderBy(forms.createdAt);
  }

  async getActiveForm(name: string): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.name, name));
    return form;
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const [form] = await db.insert(forms).values(insertForm).returning();
    return form;
  }

  async updateForm(id: number, updateData: Partial<InsertForm>): Promise<Form> {
    const [form] = await db.update(forms).set(updateData).where(eq(forms.id, id)).returning();
    return form;
  }

  async deleteForm(id: number): Promise<void> {
    await db.delete(forms).where(eq(forms.id, id));
  }

  // Form submissions methods
  async getFormSubmissions(formId: number): Promise<FormSubmission[]> {
    return await db.select().from(formSubmissions).where(eq(formSubmissions.formId, formId)).orderBy(formSubmissions.createdAt);
  }

  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const [submission] = await db.insert(formSubmissions).values(insertSubmission).returning();
    return submission;
  }
}

export const storage = new DatabaseStorage();
