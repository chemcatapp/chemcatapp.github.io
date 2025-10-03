import type { FC } from 'react';

export type SlideType = 'text' | 'image' | 'table' | 'interactive';

export interface InteractiveContent {
    type: 'balance-equation';
    equation: string;
    balanced: number[];
}

export interface Slide {
    type: SlideType;
    title?: string;
    content: string | InteractiveContent; 
}

export interface PracticeQuestion {
    type: 'multiple-choice' | 'fill-in-the-blank' | 'select-all-that-apply';
    question: string;
    options?: string[]; // For multiple-choice and select-all-that-apply
    answer: string[]; // Answer is always an array of strings. Single element for MC/FIB.
    alternatives?: string[]; // For fill-in-the-blank acceptable alternatives
    explanation: string; // Feedback for the user
}

export interface Lesson {
  id: string;
  title: string;
  slides: Slide[];
  dependencies: string[]; // lesson IDs that must be completed first
}

export interface Unit {
  id: string;
  title: string;
  color: string; // e.g., 'text-blue-600'
  bgColor: string; // e.g., 'bg-blue-100'
  darkColor?: string; // e.g., 'dark:text-blue-400'
  darkBgColor?: string; // e.g., 'dark:bg-blue-900/50'
  lessons: Lesson[];
}

export interface Progress {
  completedLessons: string[];
  streak: number;
  lastCompletedDate: string | null; // ISO date string: YYYY-MM-DD
  streakFreezesAvailable: number;
  earnedBadgeIds: string[];
  energy: number;
  weakTopics: string[];
  dailyXP: number;
}

export type ThemeColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface UserProfile {
  id: string; // Supabase user ID
  username: string; // A unique, user-chosen identifier
  email: string; // The user's login email
  name: string; // The user's display name
  avatar: string; // key from AVATARS
  themeColor: ThemeColor;
  dailyGoal: number;
  focusedSubjects: string[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    // FIX: The `React` namespace was not available. Importing `FC` from 'react' and using it directly resolves the issue.
    icon: FC<{className?: string}>;
    streakRequirement: number;
}