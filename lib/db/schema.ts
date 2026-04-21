import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ───── Auth ─────
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loginActivity = pgTable("login_activity", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  event: varchar("event", { length: 32 }).notNull(), // login, logout, otp_fail, lockout
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ───── Site content (key-value) ─────
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const navItems = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 64 }).notNull(),
  url: varchar("url", { length: 256 }).notNull(),
  order: integer("order").default(0).notNull(),
  visible: boolean("visible").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const heroContent = pgTable("hero_content", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aboutContent = pgTable("about_content", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statCards = pgTable("stat_cards", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 32 }).notNull(),
  label: varchar("label", { length: 96 }).notNull(),
  order: integer("order").default(0).notNull(),
});

export const typingWords = pgTable("typing_words", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 64 }).notNull(),
  order: integer("order").default(0).notNull(),
});

export const philosophyItems = pgTable("philosophy_items", {
  id: serial("id").primaryKey(),
  headline: varchar("headline", { length: 128 }).notNull(),
  subtitle: text("subtitle").notNull().default(""),
  order: integer("order").default(0).notNull(),
});

export const aboutFacts = pgTable("about_facts", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 64 }).notNull(),
  value: text("value").notNull(),
  order: integer("order").default(0).notNull(),
});

export const serviceCards = pgTable("service_cards", {
  id: serial("id").primaryKey(),
  icon: varchar("icon", { length: 32 }).notNull(),
  title: varchar("title", { length: 128 }).notNull(),
  body: text("body").notNull(),
  order: integer("order").default(0).notNull(),
});

// ───── Experience ─────
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 128 }).notNull(),
  role: varchar("role", { length: 128 }).notNull(),
  startDate: varchar("start_date", { length: 24 }).notNull(),
  endDate: varchar("end_date", { length: 24 }),
  isPresent: boolean("is_present").default(false).notNull(),
  location: varchar("location", { length: 128 }).notNull().default(""),
  logoUrl: text("logo_url"),
  impact: text("impact").notNull().default(""),
  order: integer("order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const experienceBullets = pgTable("experience_bullets", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id")
    .notNull()
    .references(() => experiences.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  order: integer("order").default(0).notNull(),
});

// ───── Skills / Certs / Education ─────
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 96 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  order: integer("order").default(0).notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  issuingBody: varchar("issuing_body", { length: 128 }).default(""),
  year: varchar("year", { length: 16 }).default(""),
  description: text("description").default(""),
  order: integer("order").default(0).notNull(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: varchar("institution", { length: 160 }).notNull(),
  degree: varchar("degree", { length: 160 }).notNull(),
  field: varchar("field", { length: 160 }).default(""),
  startDate: varchar("start_date", { length: 24 }).notNull(),
  endDate: varchar("end_date", { length: 24 }).notNull(),
  location: varchar("location", { length: 128 }).default(""),
  description: text("description").default(""),
  order: integer("order").default(0).notNull(),
});

// ───── Blog ─────
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    categoryId: integer("category_id").references(() => blogCategories.id, {
      onDelete: "set null",
    }),
    tags: text("tags").default(""),
    coverImageUrl: text("cover_image_url"),
    excerpt: text("excerpt").default(""),
    body: jsonb("body").$type<unknown>().default({}),
    bodyHtml: text("body_html").default(""),
    status: varchar("status", { length: 16 }).notNull().default("draft"), // draft | published
    publishedAt: timestamp("published_at"),
    metaTitle: varchar("meta_title", { length: 256 }).default(""),
    metaDescription: text("meta_description").default(""),
    ogImageUrl: text("og_image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("blog_slug_idx").on(t.slug),
  }),
);

// ───── Contact ─────
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 128 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ───── Resume ─────
export const resumeFiles = pgTable("resume_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 256 }).notNull(),
  blobUrl: text("blob_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(false).notNull(),
});
