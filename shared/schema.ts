import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  location: text("location"),
  distance: integer("distance").default(0),
  isVerified: boolean("is_verified").default(false),
  starRating: real("star_rating").default(5.0),
  fidelityPoints: integer("fidelity_points").default(100),
  dailyTugsRemaining: integer("daily_tugs_remaining").default(10),
  lastTugReset: timestamp("last_tug_reset").defaultNow(),
  totalRatingsReceived: integer("total_ratings_received").default(0),
  positiveRatings: integer("positive_ratings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tugs = pgTable("tugs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: varchar("user1_id").notNull().references(() => users.id),
  user2Id: varchar("user2_id").notNull().references(() => users.id),
  matchedAt: timestamp("matched_at").defaultNow(),
  isTied: boolean("is_tied").default(false),
  user1Rated: boolean("user1_rated").default(false),
  user2Rated: boolean("user2_rated").default(false),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  raterUserId: varchar("rater_user_id").notNull().references(() => users.id),
  ratedUserId: varchar("rated_user_id").notNull().references(() => users.id),
  matchId: varchar("match_id").references(() => matches.id),
  isPositive: boolean("is_positive").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const radarScans = pgTable("radar_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fpSpent: integer("fp_spent").notNull().default(50),
  scannedAt: timestamp("scanned_at").defaultNow(),
  boostExpiresAt: timestamp("boost_expires_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  starRating: true,
  fidelityPoints: true,
  dailyTugsRemaining: true,
  lastTugReset: true,
  totalRatingsReceived: true,
  positiveRatings: true,
});

export const insertTugSchema = createInsertSchema(tugs).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  matchedAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

export const insertRadarScanSchema = createInsertSchema(radarScans).omit({
  id: true,
  scannedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTug = z.infer<typeof insertTugSchema>;
export type Tug = typeof tugs.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRadarScan = z.infer<typeof insertRadarScanSchema>;
export type RadarScan = typeof radarScans.$inferSelect;
