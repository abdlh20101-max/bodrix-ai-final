import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Bodrix AI specific fields for multi-tier user system.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  phone: varchar("phone", { length: 20 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "developer", "premium", "pro"]).default("user").notNull(),
  accountType: mysqlEnum("accountType", ["free", "premium", "pro", "developer"]).default("free").notNull(),
  dailyMessagesLimit: int("dailyMessagesLimit").default(20).notNull(),
  dailyImagesLimit: int("dailyImagesLimit").default(2).notNull(),
  messagesUsedToday: int("messagesUsedToday").default(0).notNull(),
  imagesUsedToday: int("imagesUsedToday").default(0).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  lastResetDate: timestamp("lastResetDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Messages Table - جدول الرسائل
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).default("user").notNull(),
  language: varchar("language", { length: 10 }).default("ar").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Images Table - جدول الصور
export const images = mysqlTable("images", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  messageId: int("messageId"),
  url: varchar("url", { length: 512 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize").notNull(),
  mimeType: varchar("mimeType", { length: 50 }).notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

// Points Table - جدول النقاط
export const points = mysqlTable("points", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Point = typeof points.$inferSelect;
export type InsertPoint = typeof points.$inferInsert;

// Subscriptions Table - جدول الاشتراكات
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planType: mysqlEnum("planType", ["premium_week", "premium_month", "premium_3months", "premium_year", "pro_week", "pro_month", "pro_3months", "pro_year"]).notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Watched Ads Table - جدول الإعلانات المشاهدة
export const watchedAds = mysqlTable("watchedAds", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  adId: varchar("adId", { length: 100 }).notNull(),
  watchedAt: timestamp("watchedAt").defaultNow().notNull(),
  pointsEarned: int("pointsEarned").default(8).notNull(),
});

export type WatchedAd = typeof watchedAds.$inferSelect;
export type InsertWatchedAd = typeof watchedAds.$inferInsert;

// Referrals Table - جدول الإحالات
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredUserId: int("referredUserId"),
  referralCode: varchar("referralCode", { length: 50 }).notNull().unique(),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Shares Table - جدول المشاركات
export const shares = mysqlTable("shares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sharedWith: int("sharedWith"),
  shareDate: timestamp("shareDate").defaultNow().notNull(),
  pointsEarned: int("pointsEarned").default(5).notNull(),
});

export type Share = typeof shares.$inferSelect;
export type InsertShare = typeof shares.$inferInsert;

// Wallet Table - جدول المحفظة الإلكترونية
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: varchar("balance", { length: 20 }).default("0.00").notNull(),
  totalDeposited: varchar("totalDeposited", { length: 20 }).default("0.00").notNull(),
  totalSpent: varchar("totalSpent", { length: 20 }).default("0.00").notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// Wallet Transactions Table - جدول معاملات المحفظة
export const walletTransactions = mysqlTable("walletTransactions", {
  id: int("id").autoincrement().primaryKey(),
  walletId: int("walletId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "purchase", "refund", "bonus"]).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;

// Bank Settings Table - جدول إعدادات البنك (للمسؤول فقط)
export const bankSettings = mysqlTable("bankSettings", {
  id: int("id").autoincrement().primaryKey(),
  bankName: varchar("bankName", { length: 100 }).notNull(),
  accountName: varchar("accountName", { length: 100 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 50 }).notNull(),
  ibanNumber: varchar("ibanNumber", { length: 50 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BankSetting = typeof bankSettings.$inferSelect;
export type InsertBankSetting = typeof bankSettings.$inferInsert;

// Daily Challenges Table - جدول التحديات اليومية
export const dailyChallenges = mysqlTable("dailyChallenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("type", ["watch_ads", "send_messages", "share", "referral"]).notNull(),
  targetCount: int("targetCount").notNull(),
  rewardPoints: int("rewardPoints").notNull(),
  rewardBonus: int("rewardBonus").default(0).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = typeof dailyChallenges.$inferInsert;

// User Challenge Progress Table - جدول تقدم المستخدم في التحديات
export const userChallengeProgress = mysqlTable("userChallengeProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: int("challengeId").notNull(),
  currentCount: int("currentCount").default(0).notNull(),
  isCompleted: int("isCompleted").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = typeof userChallengeProgress.$inferInsert;


// AI Chat History Table - جدول سجل دردشة الـ AI
export const aiChatHistory = mysqlTable("aiChatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  chatType: mysqlEnum("chatType", ["admin", "private"]).default("admin").notNull(),
  aiProvider: varchar("aiProvider", { length: 50 }).default("openai").notNull(),
  aiModel: varchar("aiModel", { length: 50 }).default("gpt-4").notNull(),
  userMessage: text("userMessage").notNull(),
  aiResponse: text("aiResponse").notNull(),
  tokens: int("tokens").default(0).notNull(),
  isEncrypted: int("isEncrypted").default(0).notNull(),
  encryptionKey: varchar("encryptionKey", { length: 255 }),
  status: mysqlEnum("status", ["sent", "received", "processing", "failed"]).default("received").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIChatHistory = typeof aiChatHistory.$inferSelect;
export type InsertAIChatHistory = typeof aiChatHistory.$inferInsert;

// AI Tasks Table - جدول مهام الـ AI
export const aiTasks = mysqlTable("aiTasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  command: text("command").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  result: text("result"),
  errorMessage: text("errorMessage"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
});

export type AITask = typeof aiTasks.$inferSelect;
export type InsertAITask = typeof aiTasks.$inferInsert;

// Webhook Events Table - جدول أحداث الـ Webhook
export const webhookEvents = mysqlTable("webhookEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  trigger: text("trigger").notNull(),
  action: text("action").notNull(),
  isActive: int("isActive").default(1).notNull(),
  executionCount: int("executionCount").default(0).notNull(),
  lastExecuted: timestamp("lastExecuted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// User Permissions Table - جدول أذونات المستخدمين
export const userPermissions = mysqlTable("userPermissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  permission: varchar("permission", { length: 100 }).notNull(),
  isGranted: int("isGranted").default(1).notNull(),
  grantedBy: int("grantedBy"),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = typeof userPermissions.$inferInsert;

// Rate Limit Table - جدول حدود المعدل
export const rateLimits = mysqlTable("rateLimits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  resource: varchar("resource", { length: 100 }).notNull(),
  requestCount: int("requestCount").default(0).notNull(),
  limitPerHour: int("limitPerHour").default(100).notNull(),
  resetAt: timestamp("resetAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = typeof rateLimits.$inferInsert;

// Notifications Table - جدول الإشعارات
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["info", "success", "warning", "error", "task_completed"]).default("info").notNull(),
  isRead: int("isRead").default(0).notNull(),
  actionUrl: varchar("actionUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
