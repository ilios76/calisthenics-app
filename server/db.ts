import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscriptions, payments, streaks, Subscription, InsertSubscription, Payment, InsertPayment, Streak, InsertStreak } from "../drizzle/schema";
import { ENV } from './_core/env';

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

    const textFields = ["name", "email", "loginMethod"] as const;
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
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
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

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// Subscription queries
// ============================================================

export async function getUserSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getStripeCustomerId(userId: number): Promise<string | undefined> {
  const subscription = await getUserSubscription(userId);
  return subscription?.stripeCustomerId;
}

export async function saveStripeCustomerId(userId: number, stripeCustomerId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserSubscription(userId);
  if (existing) {
    await db
      .update(subscriptions)
      .set({ stripeCustomerId })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      stripeCustomerId,
      plan: "free",
      status: "active",
    });
  }
}

export async function saveSubscription(data: Omit<InsertSubscription, 'createdAt' | 'updatedAt'>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserSubscription(data.userId);
  if (existing) {
    await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.userId, data.userId));
  } else {
    await db.insert(subscriptions).values(data as InsertSubscription);
  }
}

export async function cancelSubscription(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}

// ============================================================
// Payment queries
// ============================================================

export async function savePayment(data: Omit<InsertPayment, 'createdAt' | 'updatedAt'>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(payments).values(data as InsertPayment);
}

export async function getPaymentHistory(userId: number): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId));
}

// ============================================================
// Streak queries
// ============================================================

export async function getUserStreak(userId: number): Promise<Streak | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateStreak(userId: number, currentStreak: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserStreak(userId);
  const longestStreak = existing ? Math.max(existing.longestStreak, currentStreak) : currentStreak;

  if (existing) {
    await db
      .update(streaks)
      .set({
        currentStreak,
        longestStreak,
        lastActivityDate: new Date(),
      })
      .where(eq(streaks.userId, userId));
  } else {
    await db.insert(streaks).values({
      userId,
      currentStreak,
      longestStreak,
      lastActivityDate: new Date(),
    });
  }
}

export async function recordMilestone(userId: number, milestone: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserStreak(userId);
  if (!existing) return;

  const milestones = existing.milestonesReached
    ? existing.milestonesReached.split(",").map(Number)
    : [];

  if (!milestones.includes(milestone)) {
    milestones.push(milestone);
    await db
      .update(streaks)
      .set({ milestonesReached: milestones.join(",") })
      .where(eq(streaks.userId, userId));
  }
}
