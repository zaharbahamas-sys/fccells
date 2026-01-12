import {
  pgTable,
  text,
  serial,
  integer,
  real,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// 1. Users (تم تعديل الاسم ليتوافق مع السيرفر)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  username: text("username").unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  jobTitle: text("job_title"),
  image: text("image"),
  bio: text("bio"),
  role: text("role").default("user"),
  status: text("status").default("pending"),
  googleId: text("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Chat System (أضفنا جداول الشات الناقصة)
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .references(() => conversations.id)
    .notNull(),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Fuel Cells Catalog
export const fuelCells = pgTable("fuel_cells", {
  id: serial("id").primaryKey(),
  manufacturer: text("manufacturer").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(),
  ratedPowerKw: real("rated_power_kw").notNull(),
  minPowerKw: real("min_power_kw").default(0),
  outputVoltageV: real("output_voltage_v").notNull(),
  fuelConsumptionPerKwh: real("fuel_consumption_per_kwh").notNull(),
  efficiency: real("efficiency").notNull(),
  parasiticLoss: real("parasitic_loss").default(0.08),
  fuelType: text("fuel_type").default("Hydrogen"),
  lhv: real("lhv").default(33.3),
  capexPerKw: real("capex_per_kw").default(3000),
  datasheetUrl: text("datasheet_url"),
  source: text("source"),
  referenceUrl: text("reference_url"),
});

// 4. Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  maxTemperature: real("max_temperature").default(35),
  altitude: real("altitude").default(0),
  loadKw: real("load_kw").notNull(),
  autonomyHours: real("autonomy_hours").notNull(),
  hoursPerYear: real("hours_per_year").default(2000),
  systemVoltage: real("system_voltage").default(48),
  dgCapacityKva: real("dg_capacity_kva").default(20),
  dieselPrice: real("diesel_price").default(1.0),
  dgCapex: real("dg_capex").default(5000),
  h2Price: real("h2_price").default(15.0),
  selectedFuelCellId: integer("selected_fuel_cell_id").references(
    () => fuelCells.id,
  ),
  batteryBufferHours: real("battery_buffer_hours").default(4),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").default("Strategic Intelligence"),
  imageUrl: text("image_url"),
  authorName: text("author_name").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 6. Comments & Contacts
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 7. App Users (for local authentication)
export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitle: text("job_title"),
  profilePhoto: text("profile_photo"),
  role: text("role").notNull().default("user"),
  status: text("status").notNull().default("pending"),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 8. Registration requests
export const registrationRequests = pgTable("registration_requests", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  organization: text("organization"),
  reason: text("reason"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 9. OTP codes
export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export const insertFuelCellSchema = createInsertSchema(fuelCells).omit({
  id: true,
});
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type FuelCell = typeof fuelCells.$inferSelect;
export type InsertFuelCell = z.infer<typeof insertFuelCellSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
