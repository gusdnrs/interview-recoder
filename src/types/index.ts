export interface Answer {
  id: string;
  content: string;
  createdAt: string; // ISO Date string
  updatedAt: string;
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
