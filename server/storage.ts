import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import {
  // جداول البيانات
  fuelCells,
  projects,
  blogPosts,
  blogComments,
  contactMessages,
  users,
  conversations,
  messages,
  // الأنواع (Types)
  type FuelCell,
  type InsertFuelCell,
  type Project,
  type InsertProject,
  type BlogPost,
  type InsertBlogPost,
  type User,
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // --- Auth & Users ---
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>; // 👈 دالة جوجل الضرورية
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  sessionStore: session.Store;

  // --- Chat ---
  getAllConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(
    conversationId: number,
    role: string,
    content: string,
  ): Promise<Message>;

  // --- Fuel Cells & Projects ---
  getFuelCells(): Promise<FuelCell[]>;
  getFuelCell(id: number): Promise<FuelCell | undefined>;
  createFuelCell(fuelCell: InsertFuelCell): Promise<FuelCell>;
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // --- Blog & Contact ---
  getBlogPosts(status?: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(
    id: number,
    post: Partial<BlogPost>,
  ): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  getCommentsByPostId(postId: number): Promise<any[]>;
  createComment(data: {
    postId: number;
    authorName: string;
    authorEmail?: string;
    content: string;
  }): Promise<any>;
  getContactMessages(): Promise<any[]>;
  createContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // ==========================
  //  Users Implementation
  // ==========================
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    // هذه الدالة التي كانت ناقصة وتسبب المشاكل
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(
    id: number,
    partialUser: Partial<User>,
  ): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(partialUser)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // ==========================
  //  Chat Implementation
  // ==========================
  async getAllConversations(): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.id));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(title: string): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ title })
      .returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.id));
  }

  async createMessage(
    conversationId: number,
    role: string,
    content: string,
  ): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        role,
        content,
      })
      .returning();
    return message;
  }

  // ==========================
  //  Existing Implementation (Fuel Cells, etc.)
  // ==========================
  async getFuelCells(): Promise<FuelCell[]> {
    return await db.select().from(fuelCells);
  }
  async getFuelCell(id: number): Promise<FuelCell | undefined> {
    const [fc] = await db.select().from(fuelCells).where(eq(fuelCells.id, id));
    return fc;
  }
  async createFuelCell(fuelCell: InsertFuelCell): Promise<FuelCell> {
    const [newFc] = await db.insert(fuelCells).values(fuelCell).returning();
    return newFc;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getBlogPosts(status?: string): Promise<BlogPost[]> {
    if (status) {
      return await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.status, status))
        .orderBy(desc(blogPosts.createdAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  async updateBlogPost(
    id: number,
    post: Partial<BlogPost>,
  ): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getCommentsByPostId(postId: number) {
    return await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.postId, postId))
      .orderBy(desc(blogComments.createdAt));
  }
  async createComment(data: any) {
    const [comment] = await db.insert(blogComments).values(data).returning();
    return comment;
  }
  async getContactMessages() {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }
  async createContactMessage(data: any) {
    const [msg] = await db.insert(contactMessages).values(data).returning();
    return msg;
  }
}

export const storage = new DatabaseStorage();
export const chatStorage = storage;
