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

export interface Schedule {
  id: string;
  companyId: string;
  title: string;
  date: string;
  description?: string;
  type?: string; // e.g., '서류', '코딩테스트', '면접', '기타'
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  jobDate?: string;
  jobLink?: string;
  questions: Question[];
  schedules: Schedule[];
  createdAt: string;
}

export type InterviewData = Company[];
