import { useLocalStorage } from './useLocalStorage';
import { Company } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

export function useInterviewData() {
  const { user } = useAuth();
  const storageKey = user
    ? `interview-data-${user.email}`
    : 'interview-data-guest';

  const [companies, setCompanies] = useLocalStorage<Company[]>(storageKey, []);

  const addCompany = (name: string, jobDate?: string, jobLink?: string) => {
    const newCompany: Company = {
      id: uuidv4(),
      name,
      jobDate,
      jobLink,
      questions: [],
      createdAt: new Date().toISOString(),
    };
    setCompanies((prev) => [...prev, newCompany]);
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCompany = (
    id: string,
    name: string,
    jobDate?: string,
    jobLink?: string,
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, name, jobDate, jobLink };
        }
        return c;
      }),
    );
  };

  const addQuestion = (
    companyId: string,
    text: string,
    categories: string[] = [],
    order?: number,
    limitType?: 'char' | 'byte' | null,
    limitCount?: number,
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: [
              ...c.questions,
              {
                id: uuidv4(),
                order,
                text,
                answers: [],
                categories,
                limitType,
                limitCount,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      }),
    );
  };

  const deleteQuestions = (companyId: string, questionIds: string[]) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: c.questions.filter((q) => !questionIds.includes(q.id)),
          };
        }
        return c;
      }),
    );
  };

  const addAnswer = (
    companyId: string,
    questionId: string,
    content: string,
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: c.questions.map((q) => {
              if (q.id === questionId) {
                return {
                  ...q,
                  answers: [
                    ...q.answers,
                    {
                      id: uuidv4(),
                      content,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                };
              }
              return q;
            }),
          };
        }
        return c;
      }),
    );
  };

  const updateAnswer = (
    companyId: string,
    questionId: string,
    answerId: string,
    newContent: string,
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: c.questions.map((q) => {
              if (q.id === questionId) {
                return {
                  ...q,
                  answers: q.answers.map((a) => {
                    if (a.id === answerId) {
                      return {
                        ...a,
                        content: newContent,
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return a;
                  }),
                };
              }
              return q;
            }),
          };
        }
        return c;
      }),
    );
  };

  // Helper to find data
  const getCompany = (id: string) => companies.find((c) => c.id === id);

  return {
    companies,
    addCompany,
    deleteCompany,
    updateCompany,
    addQuestion,
    deleteQuestions,
    addAnswer,
    updateAnswer,
    getCompany,
  };
}
