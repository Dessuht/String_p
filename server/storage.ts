import type { 
  User, InsertUser,
  Tug, InsertTug,
  Match, InsertMatch,
  Rating, InsertRating,
  RadarScan, InsertRadarScan
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(excludeUserId?: string): Promise<User[]>;
  getUsersForRadar(currentUserId: string, minRating?: number): Promise<User[]>;
  
  // Tug operations
  createTug(tug: InsertTug): Promise<Tug>;
  getTugsBetweenUsers(user1Id: string, user2Id: string): Promise<Tug[]>;
  getUserTugs(userId: string): Promise<Tug[]>;
  checkMutualTug(user1Id: string, user2Id: string): Promise<boolean>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: string): Promise<Match | undefined>;
  getUserMatches(userId: string): Promise<Match[]>;
  updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined>;
  
  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByUser(userId: string): Promise<Rating[]>;
  
  // Radar Scan operations
  createRadarScan(scan: InsertRadarScan): Promise<RadarScan>;
  getUserActiveScans(userId: string): Promise<RadarScan[]>;
  
  // Daily tug reset
  resetDailyTugsIfNeeded(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tugs: Map<string, Tug>;
  private matches: Map<string, Match>;
  private ratings: Map<string, Rating>;
  private radarScans: Map<string, RadarScan>;

  constructor() {
    this.users = new Map();
    this.tugs = new Map();
    this.matches = new Map();
    this.ratings = new Map();
    this.radarScans = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      id,
      starRating: 5.0,
      fidelityPoints: 100,
      dailyTugsRemaining: 10,
      lastTugReset: new Date(),
      totalRatingsReceived: 0,
      positiveRatings: 0,
      createdAt: new Date(),
      bio: insertUser.bio ?? null,
      avatar: insertUser.avatar ?? null,
      location: insertUser.location ?? null,
      distance: insertUser.distance ?? null,
      isVerified: insertUser.isVerified ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(excludeUserId?: string): Promise<User[]> {
    const users = Array.from(this.users.values());
    if (excludeUserId) {
      return users.filter(u => u.id !== excludeUserId);
    }
    return users;
  }

  async getUsersForRadar(currentUserId: string, minRating: number = 4.5): Promise<User[]> {
    const users = Array.from(this.users.values());
    return users.filter(u => 
      u.id !== currentUserId && 
      (u.starRating ?? 5.0) >= minRating
    );
  }

  // Tug operations
  async createTug(insertTug: InsertTug): Promise<Tug> {
    const id = randomUUID();
    const tug: Tug = {
      ...insertTug,
      id,
      createdAt: new Date(),
    };
    this.tugs.set(id, tug);
    return tug;
  }

  async getTugsBetweenUsers(user1Id: string, user2Id: string): Promise<Tug[]> {
    return Array.from(this.tugs.values()).filter(
      tug => 
        (tug.fromUserId === user1Id && tug.toUserId === user2Id) ||
        (tug.fromUserId === user2Id && tug.toUserId === user1Id)
    );
  }

  async getUserTugs(userId: string): Promise<Tug[]> {
    return Array.from(this.tugs.values()).filter(
      tug => tug.fromUserId === userId
    );
  }

  async checkMutualTug(user1Id: string, user2Id: string): Promise<boolean> {
    const tugs = await this.getTugsBetweenUsers(user1Id, user2Id);
    const user1Tugged = tugs.some(t => t.fromUserId === user1Id && t.toUserId === user2Id);
    const user2Tugged = tugs.some(t => t.fromUserId === user2Id && t.toUserId === user1Id);
    return user1Tugged && user2Tugged;
  }

  // Match operations
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = {
      ...insertMatch,
      id,
      matchedAt: new Date(),
      isTied: insertMatch.isTied ?? null,
      user1Rated: insertMatch.user1Rated ?? null,
      user2Rated: insertMatch.user2Rated ?? null,
    };
    this.matches.set(id, match);
    return match;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.user1Id === userId || match.user2Id === userId
    );
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, ...updates };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  // Rating operations
  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = randomUUID();
    const rating: Rating = {
      ...insertRating,
      id,
      createdAt: new Date(),
      matchId: insertRating.matchId ?? null,
      reason: insertRating.reason ?? null,
    };
    this.ratings.set(id, rating);
    
    // Update the rated user's star rating
    const ratedUser = await this.getUser(insertRating.ratedUserId);
    if (ratedUser) {
      const newTotalRatings = (ratedUser.totalRatingsReceived ?? 0) + 1;
      const newPositiveRatings = (ratedUser.positiveRatings ?? 0) + (insertRating.isPositive ? 1 : 0);
      const newStarRating = (newPositiveRatings / newTotalRatings) * 5;
      
      await this.updateUser(insertRating.ratedUserId, {
        totalRatingsReceived: newTotalRatings,
        positiveRatings: newPositiveRatings,
        starRating: newStarRating,
      });
      
      // Reward the rater with FP for positive ratings
      if (insertRating.isPositive) {
        const rater = await this.getUser(insertRating.raterUserId);
        if (rater) {
          await this.updateUser(insertRating.raterUserId, {
            fidelityPoints: (rater.fidelityPoints ?? 0) + 5,
          });
        }
      }
    }
    
    return rating;
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      rating => rating.raterUserId === userId || rating.ratedUserId === userId
    );
  }

  // Radar Scan operations
  async createRadarScan(insertScan: InsertRadarScan): Promise<RadarScan> {
    const id = randomUUID();
    const scan: RadarScan = {
      ...insertScan,
      id,
      scannedAt: new Date(),
      fpSpent: insertScan.fpSpent ?? 50,
    };
    this.radarScans.set(id, scan);
    return scan;
  }

  async getUserActiveScans(userId: string): Promise<RadarScan[]> {
    const now = new Date();
    return Array.from(this.radarScans.values()).filter(
      scan => scan.userId === userId && scan.boostExpiresAt > now
    );
  }

  // Daily tug reset
  async resetDailyTugsIfNeeded(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const now = new Date();
    const lastReset = user.lastTugReset ? new Date(user.lastTugReset) : new Date(0);
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 24) {
      await this.updateUser(userId, {
        dailyTugsRemaining: 10,
        lastTugReset: now,
      });
    }
  }
}

export const storage = new MemStorage();
