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
  type FuelCell, type InsertFuelCell,
  type Project, type InsertProject,
  type BlogPost, type InsertBlogPost,
  type User, type InsertUser,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // --- Auth & Users ---
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>; // 👈 دالة جوجل
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  sessionStore: session.Store;

  // --- Chat ---
  getAllConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;

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
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  getCommentsByPostId(postId: number): Promise<any[]>;
  createComment(data: { postId: number; authorName: string; authorEmail?: string; content: string }): Promise<any>;
  getContactMessages(): Promise<any[]>;
  createContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<any>;
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
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, partialUser: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(partialUser).where(eq(users.id, id)).returning();
    return updated;
  }

  // ==========================
  //  Chat Implementation
  // ==========================
  async getAllConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations).orderBy(desc(conversations.id));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.id));
  }

  async createMessage(conversationId: number, role: string, content: string): Promise<Message> {
    const [message] = await db.insert(messages).values({
      conversationId,
      role,
      content
    }).returning();
    return message;
  }

  // ==========================
  //  Fuel Cells & Projects Implementation
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
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // ==========================
  //  Blog & Contact Implementation
  // ==========================
  async getBlogPosts(status?: string): Promise<BlogPost[]> {
    if (status) {
      return await db.select().from(blogPosts).where(eq(blogPosts.status, status)).orderBy(desc(blogPosts.createdAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return updated;
  }
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getCommentsByPostId(postId: number) {
    return await db.select().from(blogComments).where(eq(blogComments.postId, postId)).orderBy(desc(blogComments.createdAt));
  }
  async createComment(data: any) {
    const [comment] = await db.insert(blogComments).values(data).returning();
    return comment;
  }
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  async createContactMessage(data: any) {
    const [msg] = await db.insert(contactMessages).values(data).returning();
    return msg;
  }
}

export const storage = new DatabaseStorage();
export const chatStorage = storage;

// ==========================
//  App Users Authentication
// ==========================
import { appUsers, otpCodes, registrationRequests } from "@shared/schema";
import { and, gt } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createSuperAdmin() {
  const existingAdmin = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, "admin@fullcells.com"))
    .limit(1);

  if (existingAdmin.length === 0) {
    await db.insert(appUsers).values({
      email: "admin@fullcells.com",
      passwordHash: hashPassword("admin123"),
      firstName: "Mohamed",
      lastName: "Abbas",
      role: "super_admin",
      status: "approved",
      emailVerified: true,
      jobTitle: "Administrator",
    });
    console.log("Super Admin account created: admin@fullcells.com / admin123");
  }

  const existingEngineer1 = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, "engineer1@fullcells.com"))
    .limit(1);

  if (existingEngineer1.length === 0) {
    await db.insert(appUsers).values({
      email: "engineer1@fullcells.com",
      passwordHash: hashPassword("engineer123"),
      firstName: "Engineer",
      lastName: "One",
      role: "user",
      status: "approved",
      emailVerified: true,
      jobTitle: "Engineer",
    });
    console.log("Engineer1 account created: engineer1@fullcells.com / engineer123");
  }

  const existingEngineer2 = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, "engineer2@fullcells.com"))
    .limit(1);

  if (existingEngineer2.length === 0) {
    await db.insert(appUsers).values({
      email: "engineer2@fullcells.com",
      passwordHash: hashPassword("engineer123"),
      firstName: "Engineer",
      lastName: "Two",
      role: "user",
      status: "approved",
      emailVerified: true,
      jobTitle: "Engineer",
    });
    console.log("Engineer2 account created: engineer2@fullcells.com / engineer123");
  }
}

export async function authenticateUser(identifier: string, password: string) {
  const isEmail = identifier.includes("@");
  const user = await db
    .select()
    .from(appUsers)
    .where(isEmail ? eq(appUsers.email, identifier) : eq(appUsers.phone, identifier))
    .limit(1);

  if (user.length === 0) {
    return { success: false, error: "User not found" };
  }

  const userData = user[0];

  if (userData.passwordHash !== hashPassword(password)) {
    return { success: false, error: "Invalid password" };
  }

  if (userData.status === "pending") {
    return { success: false, error: "Account pending approval" };
  }

  if (userData.status === "rejected") {
    return { success: false, error: "Account rejected" };
  }

  if (userData.status === "suspended") {
    return { success: false, error: "Account suspended" };
  }

  return {
    success: true,
    user: {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: userData.status,
    },
  };
}

export async function sendOtp(identifier: string, type: "email" | "phone") {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.insert(otpCodes).values({
    identifier,
    code,
    type,
    expiresAt,
  });

  console.log(`OTP for ${identifier}: ${code}`);
  return { success: true, message: `OTP sent (check console for dev)` };
}

export async function verifyOtp(identifier: string, code: string) {
  const otpRecords = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.identifier, identifier),
        eq(otpCodes.code, code),
        eq(otpCodes.verified, false),
        gt(otpCodes.expiresAt, new Date())
      )
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (otpRecords.length === 0) {
    return { success: false, error: "Invalid or expired OTP" };
  }

  await db
    .update(otpCodes)
    .set({ verified: true })
    .where(eq(otpCodes.id, otpRecords[0].id));

  return { success: true };
}

export async function submitRegistration(data: {
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  organization?: string;
  reason?: string;
  password: string;
}) {
  const identifier = data.email || data.phone;
  if (!identifier) {
    return { success: false, error: "Email or phone required" };
  }

  const existingEmail = data.email
    ? await db.select().from(appUsers).where(eq(appUsers.email, data.email)).limit(1)
    : [];
  const existingPhone = data.phone
    ? await db.select().from(appUsers).where(eq(appUsers.phone, data.phone)).limit(1)
    : [];

  if (existingEmail.length > 0 || existingPhone.length > 0) {
    return { success: false, error: "User already exists" };
  }

  await db.insert(registrationRequests).values({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    organization: data.organization,
    reason: data.reason,
  });

  await db.insert(appUsers).values({
    email: data.email,
    phone: data.phone,
    passwordHash: hashPassword(data.password),
    firstName: data.firstName,
    lastName: data.lastName,
    role: "user",
    status: "pending",
    emailVerified: !!data.email,
    phoneVerified: !!data.phone,
  });

  return { success: true, message: "Registration submitted for approval" };
}

export async function getPendingRegistrations() {
  return await db
    .select()
    .from(registrationRequests)
    .where(eq(registrationRequests.status, "pending"))
    .orderBy(desc(registrationRequests.createdAt));
}

export async function approveRegistration(
  requestId: number,
  adminId: number,
  notes?: string
) {
  const request = await db
    .select()
    .from(registrationRequests)
    .where(eq(registrationRequests.id, requestId))
    .limit(1);

  if (request.length === 0) {
    return { success: false, error: "Request not found" };
  }

  const req = request[0];

  await db
    .update(registrationRequests)
    .set({
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminNotes: notes,
    })
    .where(eq(registrationRequests.id, requestId));

  await db
    .update(appUsers)
    .set({
      status: "approved",
      approvedBy: adminId,
      approvedAt: new Date(),
    })
    .where(
      req.email ? eq(appUsers.email, req.email) : eq(appUsers.phone, req.phone!)
    );

  return { success: true, message: "Registration approved" };
}

export async function rejectRegistration(
  requestId: number,
  adminId: number,
  notes?: string
) {
  const request = await db
    .select()
    .from(registrationRequests)
    .where(eq(registrationRequests.id, requestId))
    .limit(1);

  if (request.length === 0) {
    return { success: false, error: "Request not found" };
  }

  const req = request[0];

  await db
    .update(registrationRequests)
    .set({
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminNotes: notes,
    })
    .where(eq(registrationRequests.id, requestId));

  await db
    .update(appUsers)
    .set({ status: "rejected" })
    .where(
      req.email ? eq(appUsers.email, req.email) : eq(appUsers.phone, req.phone!)
    );

  return { success: true, message: "Registration rejected" };
}

export async function getAllUsers() {
  return await db
    .select({
      id: appUsers.id,
      email: appUsers.email,
      phone: appUsers.phone,
      firstName: appUsers.firstName,
      lastName: appUsers.lastName,
      role: appUsers.role,
      status: appUsers.status,
      createdAt: appUsers.createdAt,
    })
    .from(appUsers)
    .orderBy(desc(appUsers.createdAt));
}

export async function getUserById(userId: number) {
  const user = await db
    .select({
      id: appUsers.id,
      email: appUsers.email,
      phone: appUsers.phone,
      firstName: appUsers.firstName,
      lastName: appUsers.lastName,
      jobTitle: appUsers.jobTitle,
      profilePhoto: appUsers.profilePhoto,
      role: appUsers.role,
      status: appUsers.status,
    })
    .from(appUsers)
    .where(eq(appUsers.id, userId))
    .limit(1);
  
  return user[0] || null;
}

export async function updateUserProfile(
  userId: number,
  data: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    profilePhoto?: string;
  }
) {
  const updateData: any = { updatedAt: new Date() };
  if (data.firstName) updateData.firstName = data.firstName;
  if (data.lastName) updateData.lastName = data.lastName;
  if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
  if (data.profilePhoto !== undefined) updateData.profilePhoto = data.profilePhoto;

  await db.update(appUsers).set(updateData).where(eq(appUsers.id, userId));
  
  return { success: true, message: "Profile updated" };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, userId))
    .limit(1);

  if (user.length === 0) {
    return { success: false, error: "User not found" };
  }

  if (user[0].passwordHash !== hashPassword(currentPassword)) {
    return { success: false, error: "Current password is incorrect" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters" };
  }

  await db
    .update(appUsers)
    .set({ passwordHash: hashPassword(newPassword), updatedAt: new Date() })
    .where(eq(appUsers.id, userId));

  return { success: true, message: "Password changed successfully" };
}
