import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTugSchema, 
  insertRatingSchema,
  insertRadarScanSchema 
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const excludeUserId = req.query.excludeUserId as string | undefined;
      const users = await storage.getAllUsers(excludeUserId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Tug routes
  app.post("/api/tugs", async (req, res) => {
    try {
      const validated = insertTugSchema.parse(req.body);
      
      // Check and reset daily tugs if needed
      await storage.resetDailyTugsIfNeeded(validated.fromUserId);
      
      // Check if user has tugs remaining
      const user = await storage.getUser(validated.fromUserId);
      if (!user || (user.dailyTugsRemaining ?? 0) <= 0) {
        return res.status(400).json({ error: "No tugs remaining today" });
      }
      
      // Create the tug
      const tug = await storage.createTug(validated);
      
      // Decrement daily tugs
      await storage.updateUser(validated.fromUserId, {
        dailyTugsRemaining: (user.dailyTugsRemaining ?? 0) - 1,
      });
      
      // Check for mutual tug and create match if exists
      const isMutual = await storage.checkMutualTug(
        validated.fromUserId,
        validated.toUserId
      );
      
      if (isMutual) {
        await storage.createMatch({
          user1Id: validated.fromUserId,
          user2Id: validated.toUserId,
        });
      }
      
      res.status(201).json({ tug, isMutual });
    } catch (error) {
      res.status(400).json({ error: "Failed to create tug" });
    }
  });

  app.get("/api/tugs/user/:userId", async (req, res) => {
    try {
      const tugs = await storage.getUserTugs(req.params.userId);
      res.json(tugs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tugs" });
    }
  });

  app.get("/api/tugs/check/:user1Id/:user2Id", async (req, res) => {
    try {
      const isMutual = await storage.checkMutualTug(
        req.params.user1Id,
        req.params.user2Id
      );
      res.json({ isMutual });
    } catch (error) {
      res.status(500).json({ error: "Failed to check mutual tug" });
    }
  });

  // Match routes
  app.get("/api/matches/user/:userId", async (req, res) => {
    try {
      const matches = await storage.getUserMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to update match" });
    }
  });

  // Rating routes
  app.post("/api/ratings", async (req, res) => {
    try {
      const validated = insertRatingSchema.parse(req.body);
      
      // Validate that negative ratings have a reason
      if (!validated.isPositive && !validated.reason) {
        return res.status(400).json({ error: "Negative ratings require a reason" });
      }
      
      const rating = await storage.createRating(validated);
      
      // Update match rating status if matchId is provided
      if (validated.matchId) {
        const match = await storage.getMatch(validated.matchId);
        if (match) {
          const isUser1 = match.user1Id === validated.raterUserId;
          const updateField = isUser1 ? { user1Rated: true } : { user2Rated: true };
          await storage.updateMatch(validated.matchId, updateField);
        }
      }
      
      res.status(201).json(rating);
    } catch (error) {
      res.status(400).json({ error: "Failed to create rating" });
    }
  });

  app.get("/api/ratings/user/:userId", async (req, res) => {
    try {
      const ratings = await storage.getRatingsByUser(req.params.userId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  // Radar Scan routes
  app.post("/api/radar-scans", async (req, res) => {
    try {
      const validated = insertRadarScanSchema.parse(req.body);
      
      // Check if user has enough FP
      const user = await storage.getUser(validated.userId);
      if (!user || (user.fidelityPoints ?? 0) < (validated.fpSpent ?? 50)) {
        return res.status(400).json({ error: "Insufficient fidelity points" });
      }
      
      // Deduct FP from user
      await storage.updateUser(validated.userId, {
        fidelityPoints: (user.fidelityPoints ?? 0) - (validated.fpSpent ?? 50),
      });
      
      // Create radar scan
      const scan = await storage.createRadarScan(validated);
      
      // Get high-rated users for radar
      const highRatedUsers = await storage.getUsersForRadar(validated.userId, 4.5);
      
      res.status(201).json({ scan, highRatedUsers });
    } catch (error) {
      res.status(400).json({ error: "Failed to create radar scan" });
    }
  });

  app.get("/api/radar-scans/user/:userId/active", async (req, res) => {
    try {
      const scans = await storage.getUserActiveScans(req.params.userId);
      res.json(scans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active scans" });
    }
  });

  return httpServer;
}
