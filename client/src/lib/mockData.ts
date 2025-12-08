import { useState, useEffect } from "react";
import avatar1 from "@assets/generated_images/portrait_of_a_smiling_young_woman.png";
import avatar2 from "@assets/generated_images/portrait_of_a_casual_young_man.png";
import avatar3 from "@assets/generated_images/portrait_of_a_creative_person.png";

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  isVerified: boolean;
  grades: number[]; // Last 3 grades (1-5)
  isPremium: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isRepliedTo: boolean; // Vital for the "pop up" logic
}

export interface Match {
  id: string;
  users: [string, string];
  timestamp: Date;
  messageCount: number;
  graded: boolean;
}

// Mock Database
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex",
    age: 24,
    bio: "Looking for someone to untangle life's mysteries with.",
    avatar: avatar1,
    isVerified: true,
    grades: [4, 5, 5],
    isPremium: false,
  },
  {
    id: "2",
    name: "Jordan",
    age: 27,
    bio: "Artist, coffee lover, and believer in fate.",
    avatar: avatar2,
    isVerified: true,
    grades: [5, 4, 4],
    isPremium: true,
  },
  {
    id: "3",
    name: "Taylor",
    age: 25,
    bio: "Just following the string to see where it leads.",
    avatar: avatar3,
    isVerified: false,
    grades: [3, 4, 3],
    isPremium: false,
  },
  {
    id: "me",
    name: "You",
    age: 26,
    bio: "Ready to connect.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isVerified: true,
    grades: [5, 5, 4],
    isPremium: true, // Making current user premium for demo purposes mostly
  }
];

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    users: ["me", "1"],
    timestamp: new Date(Date.now() - 86400000),
    messageCount: 3,
    graded: false,
  },
  {
    id: "m2",
    users: ["me", "2"],
    timestamp: new Date(Date.now() - 172800000),
    messageCount: 6, // Ready for grading
    graded: false,
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
  },
  {
    id: "msg2",
    senderId: "me",
    receiverId: "1",
    content: "Thanks! I like yours too. What kind of art do you make?",
    timestamp: new Date(Date.now() - 70000000),
    isRead: true,
    isRepliedTo: true,
  },
  {
    id: "msg3",
    senderId: "1",
    receiverId: "me",
    content: "Mostly abstract stuff. Red strings, actually! ironic haha",
    timestamp: new Date(Date.now() - 60000000),
    isRead: false,
    isRepliedTo: false, // Wait for reply
  },
  {
    id: "msg4",
    senderId: "2",
    receiverId: "me",
    content: "Hi there!",
    timestamp: new Date(Date.now() - 100000),
    isRead: false,
    isRepliedTo: false, // New match message
  }
];
