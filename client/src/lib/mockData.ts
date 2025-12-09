import { useState, useEffect } from "react";
import avatar1 from "@assets/generated_images/portrait_of_a_smiling_young_woman.png";
import avatar2 from "@assets/generated_images/portrait_of_a_casual_young_man.png";
import avatar3 from "@assets/generated_images/portrait_of_a_creative_person.png";

export type RelationshipGoal = "the_knot" | "red_thread" | "casual_string";
export type LifeStage = "student" | "building_career" | "established_career" | "transitioning" | "retired";
export type VerificationStatus = "none" | "pending" | "verified";

export const CORE_VALUES = [
  "Ambition", "Humor", "Health", "Family", "Adventure", 
  "Creativity", "Loyalty", "Independence", "Spirituality", "Learning"
] as const;

export const DEEP_DIVE_PROMPTS = [
  "The hill I will always die on is...",
  "My perfect Sunday looks like...",
  "The way to my heart is...",
  "I'm convinced that...",
  "Something I've never told anyone...",
  "My most controversial opinion...",
  "I get way too excited about...",
  "A life goal I'm working toward...",
  "The best advice I ever received...",
  "What I value most in a partner..."
] as const;

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  starRating: number;
  totalRatingsReceived: number;
  positiveRatings: number;
  fidelityPoints: number;
  dailyTugsRemaining: number;
  isPremium: boolean;
  distance: number;
  location?: { lat: number; lng: number };
  voicePromptUrl?: string;
  relationshipGoal: RelationshipGoal;
  investmentLevel: number;
  coreValues: string[];
  deepDivePrompts: { prompt: string; answer: string }[];
  lifeStage: LifeStage;
  isSuspended?: boolean;
  suspendedUntil?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isRepliedTo: boolean;
  type?: "text" | "date_suggestion" | "system";
  dateSuggestion?: DateSpot;
}

export type KnotStatus = "chatting" | "knot_requested" | "knotted" | "archived" | "permanently_knotted";

export interface Match {
  id: string;
  users: [string, string];
  timestamp: Date;
  messageCount: number;
  user1MessageCount: number;
  user2MessageCount: number;
  graded: boolean;
  knotStatus: KnotStatus;
  knotRequestedBy?: string;
  knotRequestedAt?: Date;
  knottedAt?: Date;
  chatExpiresAt: Date;
  scheduledDate?: ScheduledDate;
}

export interface DateSpot {
  id: string;
  name: string;
  rating: number;
  priceLevel: number;
  category: string;
  address: string;
  distance: number;
  imageUrl: string;
  mapUrl: string;
}

export interface ScheduledDate {
  id: string;
  spotId: string;
  spot: DateSpot;
  scheduledFor: Date;
  user1Confirmed: boolean;
  user2Confirmed: boolean;
  confirmationRemindedAt?: Date;
  status: "pending" | "confirmed" | "completed" | "no_show" | "cancelled";
  user1Attended?: boolean;
  user2Attended?: boolean;
  feedbackPromptedAt?: Date;
  user1Feedback?: DateFeedback;
  user2Feedback?: DateFeedback;
}

export interface DateFeedback {
  attended: boolean;
  partnerAttended: boolean;
  outcome: "planning_another" | "tie_permanently" | "not_interested" | "no_show_reported";
  comments?: string;
  submittedAt: Date;
}

export const MOCK_DATE_SPOTS: DateSpot[] = [
  {
    id: "ds1",
    name: "The Cozy Bean Cafe",
    rating: 4.5,
    priceLevel: 2,
    category: "Cafe",
    address: "123 Main St, Downtown",
    distance: 1.2,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    mapUrl: "https://maps.google.com/?q=123+Main+St"
  },
  {
    id: "ds2",
    name: "Riverside Park",
    rating: 4.7,
    priceLevel: 1,
    category: "Park",
    address: "Riverside Dr & Oak Ave",
    distance: 0.8,
    imageUrl: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400",
    mapUrl: "https://maps.google.com/?q=Riverside+Park"
  },
  {
    id: "ds3",
    name: "Sunset Bistro",
    rating: 4.3,
    priceLevel: 2,
    category: "Casual Dining",
    address: "456 Elm Street",
    distance: 2.1,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    mapUrl: "https://maps.google.com/?q=456+Elm+Street"
  },
  {
    id: "ds4",
    name: "Art District Coffee",
    rating: 4.6,
    priceLevel: 2,
    category: "Cafe",
    address: "789 Gallery Row",
    distance: 1.5,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    mapUrl: "https://maps.google.com/?q=789+Gallery+Row"
  },
  {
    id: "ds5",
    name: "Central Gardens",
    rating: 4.4,
    priceLevel: 1,
    category: "Park",
    address: "Central Ave",
    distance: 0.5,
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
    mapUrl: "https://maps.google.com/?q=Central+Gardens"
  }
];

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex",
    age: 24,
    bio: "Looking for someone to untangle life's mysteries with.",
    avatar: avatar1,
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.7,
    totalRatingsReceived: 15,
    positiveRatings: 14,
    fidelityPoints: 120,
    dailyTugsRemaining: 7,
    isPremium: false,
    distance: 120,
    location: { lat: 40.7128, lng: -74.0060 },
    voicePromptUrl: "/audio/alex_voice.mp3",
    relationshipGoal: "the_knot",
    investmentLevel: 4,
    coreValues: ["Ambition", "Humor", "Adventure"],
    deepDivePrompts: [
      { prompt: "The hill I will always die on is...", answer: "Pineapple absolutely belongs on pizza. Fight me." },
      { prompt: "My perfect Sunday looks like...", answer: "Brunch with friends, a long walk in the park, and movie night." },
      { prompt: "The way to my heart is...", answer: "Through genuine curiosity and terrible puns." }
    ],
    lifeStage: "building_career"
  },
  {
    id: "2",
    name: "Jordan",
    age: 27,
    bio: "Artist, coffee lover, and believer in fate.",
    avatar: avatar2,
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.3,
    totalRatingsReceived: 23,
    positiveRatings: 20,
    fidelityPoints: 250,
    dailyTugsRemaining: 10,
    isPremium: true,
    distance: 450,
    location: { lat: 40.7200, lng: -74.0100 },
    relationshipGoal: "red_thread",
    investmentLevel: 3,
    coreValues: ["Creativity", "Independence", "Spirituality"],
    deepDivePrompts: [
      { prompt: "I get way too excited about...", answer: "Finding hidden art galleries and vintage bookstores." },
      { prompt: "My most controversial opinion...", answer: "Modern art is just as valid as classical. Yes, even the banana." }
    ],
    lifeStage: "building_career"
  },
  {
    id: "3",
    name: "Taylor",
    age: 25,
    bio: "Just following the string to see where it leads.",
    avatar: avatar3,
    isVerified: false,
    verificationStatus: "pending",
    starRating: 3.3,
    totalRatingsReceived: 9,
    positiveRatings: 6,
    fidelityPoints: 80,
    dailyTugsRemaining: 5,
    isPremium: false,
    distance: 80,
    relationshipGoal: "casual_string",
    investmentLevel: 2,
    coreValues: ["Adventure", "Humor", "Independence"],
    deepDivePrompts: [],
    lifeStage: "student"
  },
  {
    id: "4",
    name: "Morgan",
    age: 22,
    bio: "Student by day, gamer by night. Let's coop?",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
    isVerified: true,
    verificationStatus: "verified",
    starRating: 5.0,
    totalRatingsReceived: 12,
    positiveRatings: 12,
    fidelityPoints: 200,
    dailyTugsRemaining: 8,
    isPremium: false,
    distance: 1200,
    relationshipGoal: "casual_string",
    investmentLevel: 3,
    coreValues: ["Humor", "Loyalty", "Learning"],
    deepDivePrompts: [],
    lifeStage: "student"
  },
  {
    id: "5",
    name: "Casey",
    age: 29,
    bio: "Chef who loves spicy food and bad puns.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.0,
    totalRatingsReceived: 20,
    positiveRatings: 16,
    fidelityPoints: 150,
    dailyTugsRemaining: 6,
    isPremium: true,
    distance: 60,
    relationshipGoal: "the_knot",
    investmentLevel: 5,
    coreValues: ["Family", "Creativity", "Health"],
    deepDivePrompts: [],
    lifeStage: "established_career"
  },
  {
    id: "6",
    name: "Riley",
    age: 26,
    bio: "Hiking, photography, and finding the perfect sunset.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
    isVerified: false,
    verificationStatus: "none",
    starRating: 3.0,
    totalRatingsReceived: 10,
    positiveRatings: 6,
    fidelityPoints: 70,
    dailyTugsRemaining: 4,
    isPremium: false,
    distance: 3000,
    relationshipGoal: "red_thread",
    investmentLevel: 2,
    coreValues: ["Adventure", "Health", "Creativity"],
    deepDivePrompts: [],
    lifeStage: "transitioning"
  },
  {
    id: "7",
    name: "Jamie",
    age: 23,
    bio: "Music producer. Always listening.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60",
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.7,
    totalRatingsReceived: 18,
    positiveRatings: 17,
    fidelityPoints: 180,
    dailyTugsRemaining: 9,
    isPremium: false,
    distance: 15,
    relationshipGoal: "the_knot",
    investmentLevel: 4,
    coreValues: ["Creativity", "Independence", "Ambition"],
    deepDivePrompts: [],
    lifeStage: "building_career"
  },
  {
    id: "8",
    name: "Quinn",
    age: 28,
    bio: "Architect. I build things, including relationships.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.0,
    totalRatingsReceived: 25,
    positiveRatings: 20,
    fidelityPoints: 220,
    dailyTugsRemaining: 7,
    isPremium: true,
    distance: 500,
    relationshipGoal: "the_knot",
    investmentLevel: 5,
    coreValues: ["Ambition", "Family", "Loyalty"],
    deepDivePrompts: [],
    lifeStage: "established_career"
  },
  {
    id: "me",
    name: "You",
    age: 26,
    bio: "Ready to connect.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isVerified: true,
    verificationStatus: "verified",
    starRating: 4.7,
    totalRatingsReceived: 21,
    positiveRatings: 20,
    fidelityPoints: 300,
    dailyTugsRemaining: 10,
    isPremium: true, 
    distance: 0,
    location: { lat: 40.7150, lng: -74.0080 },
    relationshipGoal: "the_knot",
    investmentLevel: 4,
    coreValues: ["Ambition", "Humor", "Loyalty"],
    deepDivePrompts: [
      { prompt: "The hill I will always die on is...", answer: "Good communication is the foundation of everything." },
      { prompt: "A life goal I'm working toward...", answer: "Building something meaningful that lasts." }
    ],
    lifeStage: "building_career"
  }
];

const CHAT_EXPIRY_HOURS = 72;

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    users: ["me", "1"],
    timestamp: new Date(Date.now() - 86400000),
    messageCount: 3,
    user1MessageCount: 2,
    user2MessageCount: 1,
    graded: false,
    knotStatus: "chatting",
    chatExpiresAt: new Date(Date.now() + (CHAT_EXPIRY_HOURS * 60 * 60 * 1000) - 86400000),
  },
  {
    id: "m2",
    users: ["me", "2"],
    timestamp: new Date(Date.now() - 172800000),
    messageCount: 6,
    user1MessageCount: 3,
    user2MessageCount: 3,
    graded: false,
    knotStatus: "chatting",
    chatExpiresAt: new Date(Date.now() + (CHAT_EXPIRY_HOURS * 60 * 60 * 1000) - 172800000),
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg1",
    senderId: "1",
    receiverId: "me",
    content: "Hey! I love your bio.",
    timestamp: new Date(Date.now() - 80000000),
    isRead: true,
    isRepliedTo: true,
    type: "text"
  },
  {
    id: "msg2",
    senderId: "me",
    receiverId: "1",
    content: "Thanks! I like yours too. What kind of mysteries are you into?",
    timestamp: new Date(Date.now() - 70000000),
    isRead: true,
    isRepliedTo: true,
    type: "text"
  },
  {
    id: "msg3",
    senderId: "1",
    receiverId: "me",
    content: "Everything from true crime podcasts to why my plants keep dying despite my best efforts! What about you?",
    timestamp: new Date(Date.now() - 60000000),
    isRead: false,
    isRepliedTo: false,
    type: "text"
  },
  {
    id: "msg4",
    senderId: "2",
    receiverId: "me",
    content: "Hi there!",
    timestamp: new Date(Date.now() - 100000),
    isRead: false,
    isRepliedTo: false,
    type: "text"
  }
];

export function getRelationshipGoalLabel(goal: RelationshipGoal): string {
  switch (goal) {
    case "the_knot": return "The Knot";
    case "red_thread": return "Red Thread";
    case "casual_string": return "Casual String";
    default: return goal;
  }
}

export function getLifeStageLabel(stage: LifeStage): string {
  switch (stage) {
    case "student": return "Student";
    case "building_career": return "Building Career";
    case "established_career": return "Established Career";
    case "transitioning": return "Transitioning";
    case "retired": return "Retired";
    default: return stage;
  }
}

export function calculateTimeRemaining(expiresAt: Date | undefined): { hours: number; minutes: number; expired: boolean } {
  if (!expiresAt) {
    return { hours: 72, minutes: 0, expired: false };
  }
  
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, expired: true };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, expired: false };
}

export function checkMessageThreshold(match: Match): boolean {
  const THRESHOLD = 5;
  return match.user1MessageCount >= THRESHOLD && match.user2MessageCount >= THRESHOLD;
}
