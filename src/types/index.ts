export interface Answer {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  email: string;
  password?: string; // Optional in memory, required for storage logic
}

export interface Question {
  id: string;
  order?: number;
  text: string;
  answers: Answer[];
  categories: string[];
  limitType?: 'char' | 'byte' | null;
  limitCount?: number;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  jobDate?: string;
  jobLink?: string;
  questions: Question[];
  createdAt: string;
}

export type InterviewData = Company[];
