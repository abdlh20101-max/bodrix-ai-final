import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  messages,
  images,
  points,
  subscriptions,
  watchedAds,
  referrals,
  shares,
  wallets,
  walletTransactions,
  bankSettings,
  InsertMessage,
  InsertImage,
  InsertPoint,
  InsertSubscription,
  InsertWatchedAd,
  InsertReferral,
  InsertShare,
  InsertWallet,
  InsertWalletTransaction,
  InsertBankSetting,
  dailyChallenges,
  userChallengeProgress,
  InsertDailyChallenge,
  InsertUserChallengeProgress,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "username", "passwordHash", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByPhone(phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  const normalized = phone.replace(/\s/g, "");
  const result = await db.select().from(users).where(eq(users.phone, normalized)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: InsertUser): Promise<User | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(users).values(user);
  if (user.username) return getUserByUsername(user.username);
  if (user.phone) return getUserByPhone(user.phone);
  return getUserByOpenId(user.openId);
}

// ============ MESSAGE FUNCTIONS ============

export async function addMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(message);
  return result;
}

export async function getUserMessages(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

// ============ IMAGE FUNCTIONS ============

export async function addImage(image: InsertImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(images).values(image);
}

export async function getUserImages(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(images)
    .where(eq(images.userId, userId))
    .orderBy(desc(images.uploadedAt))
    .limit(limit);
}

export async function getMessageImages(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(images)
    .where(eq(images.messageId, messageId));
}

// ============ POINTS FUNCTIONS ============

export async function addPoints(point: InsertPoint) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(points).values(point);

  // Update user total points
  const user = await getUserById(point.userId);
  if (user) {
    const totalPoints = user.totalPoints + point.amount;
    await db
      .update(users)
      .set({ totalPoints })
      .where(eq(users.id, point.userId));
  }
}

export async function getUserPoints(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  return user?.totalPoints || 0;
}

export async function getUserPointsHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(points)
    .where(eq(points.userId, userId))
    .orderBy(desc(points.createdAt))
    .limit(limit);
}

// Add this function after line 227 (before DAILY LIMIT FUNCTIONS comment)

/**
 * Calculate total daily message limit including ad bonuses
 * Base: 20 messages for free users
 * Bonus: +10 messages per watched ad (today)
 * Unlimited for premium/pro users
 */
export async function calculateMessageLimit(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  // If user has subscription, unlimited
  if (user.accountType !== "free") {
    return 999999;
  }

  // Base limit for free users: 20 messages
  let baseLimit = 20;

  // Count ads watched today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const adsWatchedToday = await db
    .select()
    .from(watchedAds)
    .where(
      and(
        eq(watchedAds.userId, userId),
        gte(watchedAds.watchedAt, today)
      )
    );

  // Add 10 messages per ad watched
  const adBonus = adsWatchedToday.length * 10;

  return baseLimit + adBonus;
}
// ============ DAILY LIMIT FUNCTIONS ============

export async function checkDailyLimit(userId: number, type: "messages" | "images") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const now = new Date();
  const lastReset = new Date(user.lastResetDate);

  // Check if it's a new day
  if (now.getDate() !== lastReset.getDate()) {
    // Reset daily limits
    await db
      .update(users)
      .set({
        messagesUsedToday: 0,
        imagesUsedToday: 0,
        lastResetDate: now,
      })
      .where(eq(users.id, userId));

    return {
      limit: type === "messages" ? user.dailyMessagesLimit : user.dailyImagesLimit,
      used: 0,
      remaining:
        type === "messages" ? user.dailyMessagesLimit : user.dailyImagesLimit,
    };
  }

  const limit =
    type === "messages" ? user.dailyMessagesLimit : user.dailyImagesLimit;
  const used =
    type === "messages" ? user.messagesUsedToday : user.imagesUsedToday;
  const remaining = Math.max(0, limit - used);

  return { limit, used, remaining };
}

export async function incrementDailyUsage(
  userId: number,
  type: "messages" | "images",
  amount: number = 1
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const field = type === "messages" ? "messagesUsedToday" : "imagesUsedToday";
  const currentValue =
    type === "messages" ? user.messagesUsedToday : user.imagesUsedToday;

  const updateData: Record<string, number> = {};
  updateData[field] = currentValue + amount;

  await db
    .update(users)
    .set(updateData as any)
    .where(eq(users.id, userId));
}

// ============ SUBSCRIPTION FUNCTIONS ============

export async function addSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription);

  // Update user account type
  const planType = subscription.planType;
  const accountType = planType.startsWith("premium") ? "premium" : "pro";

  await db
    .update(users)
    .set({
      accountType,
      dailyMessagesLimit: 999999, // Unlimited
      dailyImagesLimit: 999999, // Unlimited
    })
    .where(eq(users.id, subscription.userId));

  return result;
}

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSubscriptionHistory(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

// ============ WATCHED ADS FUNCTIONS ============

export async function addWatchedAd(ad: InsertWatchedAd) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(watchedAds).values(ad);

  // Add points to user
  await addPoints({
    userId: ad.userId,
    amount: ad.pointsEarned || 8,
    reason: "watch_ad",
  });
}

export async function getUserWatchedAds(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(watchedAds)
    .where(eq(watchedAds.userId, userId))
    .orderBy(desc(watchedAds.watchedAt));
}

export async function hasUserWatchedAd(userId: number, adId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(watchedAds)
    .where(
      and(eq(watchedAds.userId, userId), eq(watchedAds.adId, adId))
    )
    .limit(1);

  return result.length > 0;
}

// ============ REFERRAL FUNCTIONS ============

export async function createReferral(referral: InsertReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(referrals).values(referral);
}

export async function completeReferral(referralId: number, pointsEarned: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.id, referralId))
    .limit(1);

  if (referral.length === 0) throw new Error("Referral not found");

  const referrerUserId = referral[0]?.referrerId;
  if (!referrerUserId) throw new Error("Referrer not found");

  await db
    .update(referrals)
    .set({
      status: "completed",
      pointsEarned,
      completedAt: new Date(),
    })
    .where(eq(referrals.id, referralId));

  // Add points to referrer
  await addPoints({
    userId: referrerUserId,
    amount: pointsEarned,
    reason: "referral",
  });
}

export async function getUserReferrals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(referrals.createdAt));
}

export async function getReferralByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, code))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ SHARE FUNCTIONS ============

export async function addShare(share: InsertShare) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(shares).values(share);

  // Add points to user
  await addPoints({
    userId: share.userId,
    amount: share.pointsEarned || 5,
    reason: "share",
  });
}

export async function getUserShares(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(shares)
    .where(eq(shares.userId, userId))
    .orderBy(desc(shares.shareDate));
}

// ============ DAILY CHALLENGES FUNCTIONS ============

export async function getDailyChallenges() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await db
    .select()
    .from(dailyChallenges)
    .where(
      and(
        eq(dailyChallenges.isActive, 1),
        gte(dailyChallenges.date, today)
      )
    );
}

export async function getUserChallengeProgress(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await db
    .select()
    .from(userChallengeProgress)
    .where(
      and(
        eq(userChallengeProgress.userId, userId),
        gte(userChallengeProgress.date, today)
      )
    );
}

export async function updateChallengeProgress(userId: number, challengeId: number, increment: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await db
    .select()
    .from(userChallengeProgress)
    .where(
      and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId),
        gte(userChallengeProgress.date, today)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const progress = existing[0];
    const challenge = await db
      .select()
      .from(dailyChallenges)
      .where(eq(dailyChallenges.id, challengeId))
      .limit(1);

    if (challenge.length === 0) throw new Error("Challenge not found");

    const newCount = progress.currentCount + increment;
    const isCompleted = newCount >= challenge[0].targetCount ? 1 : 0;

    await db
      .update(userChallengeProgress)
      .set({
        currentCount: newCount,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      })
      .where(eq(userChallengeProgress.id, progress.id));

    // Award points if completed
    if (isCompleted && !progress.isCompleted) {
      await addPoints({
        userId,
        amount: challenge[0].rewardPoints,
        reason: "challenge_completed",
      });
    }

    return { ...progress, currentCount: newCount, isCompleted };
  } else {
    // Create new progress
    await db.insert(userChallengeProgress).values({
      userId,
      challengeId,
      currentCount: increment,
      date: new Date(),
    });

    return { userId, challengeId, currentCount: increment, isCompleted: 0 };
  }
}
