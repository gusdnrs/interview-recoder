import { useState, useEffect, useCallback } from 'react';
import { Company, Question, Answer } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function useInterviewData() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when user exists
  useEffect(() => {
    if (!user) {
      setCompanies([]);
      return;
    }

    const fetchData = async () => {
      // Only show loading state if we don't have data yet
      if (companies.length === 0) {
        setIsLoading(true);
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select(
            `
            *,
            questions (
              *,
              answers
            )
          `,
          )
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map DB shape to App shape
        const formattedData: Company[] = (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          jobDate: c.job_date,
          jobLink: c.job_link,
          createdAt: c.created_at,
          questions: (c.questions || [])
            .map((q: any) => ({
              id: q.id,
              text: q.text,
              categories: q.categories || [],
              order: q.order_num,
              limitType: q.limit_type,
              limitCount: q.limit_count,
              createdAt: q.created_at,
              answers: q.answers || [], // JSONB automapped
            }))
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
        }));

        setCompanies(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.email]); // Dependency on email string to avoid object ref changes

  const addCompany = async (
    name: string,
    jobDate?: string,
    jobLink?: string,
  ) => {
    if (!user) return;
    try {
      // Optimistic update
      const tempId = uuidv4();
      const newCompany: Company = {
        id: tempId,
        name,
        jobDate,
        jobLink,
        questions: [],
        createdAt: new Date().toISOString(),
      };
      setCompanies((prev) => [newCompany, ...prev]);

      const { data, error } = await supabase
        .from('companies')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          name,
          job_date: jobDate,
          job_link: jobLink,
        })
        .select()
        .single();

      if (error) throw error;

      // Update ID to real one
      setCompanies((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, id: data.id } : c)),
      );
    } catch (err) {
      console.error('Error adding company:', err);
      // Revert optional? For simplicity, we just log
    }
  };

  const deleteCompany = async (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    await supabase.from('companies').delete().eq('id', id);
  };

  const updateCompany = async (
    id: string,
    name: string,
    jobDate?: string,
    jobLink?: string,
  ) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name, jobDate, jobLink } : c)),
    );

    await supabase
      .from('companies')
      .update({
        name,
        job_date: jobDate,
        job_link: jobLink,
      })
      .eq('id', id);
  };

  const addQuestion = async (
    companyId: string,
    text: string,
    categories: string[] = [],
    order?: number,
    limitType?: 'char' | 'byte' | null,
    limitCount?: number,
  ) => {
    const tempId = uuidv4();
    const newQuestion: Question = {
      id: tempId,
      text,
      categories,
      order,
      limitType: limitType || undefined,
      limitCount,
      answers: [],
      createdAt: new Date().toISOString(),
    };

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return { ...c, questions: [...c.questions, newQuestion] };
        }
        return c;
      }),
    );

    const { data, error } = await supabase
      .from('questions')
      .insert({
        company_id: companyId,
        text,
        categories,
        order_num: order,
        limit_type: limitType,
        limit_count: limitCount,
        answers: [], // Init empty jsonb
      })
      .select()
      .single();

    if (!error && data) {
      // Update temp ID
      setCompanies((prev) =>
        prev.map((c) => {
          if (c.id === companyId) {
            return {
              ...c,
              questions: c.questions.map((q) =>
                q.id === tempId ? { ...q, id: data.id } : q,
              ),
            };
          }
          return c;
        }),
      );
    }
  };

  const deleteQuestions = async (companyId: string, questionIds: string[]) => {
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

    await supabase.from('questions').delete().in('id', questionIds);
  };

  const addAnswer = async (
    companyId: string,
    questionId: string,
    content: string,
  ) => {
    const newAnswer: Answer = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Find current answers to update
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;
    const question = company.questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedAnswers = [...question.answers, newAnswer];

    // UI Update
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: c.questions.map((q) => {
              if (q.id === questionId) {
                return { ...q, answers: updatedAnswers };
              }
              return q;
            }),
          };
        }
        return c;
      }),
    );

    // DB Update
    await supabase
      .from('questions')
      .update({ answers: updatedAnswers })
      .eq('id', questionId);
  };

  const updateAnswer = async (
    companyId: string,
    questionId: string,
    answerId: string,
    newContent: string,
  ) => {
    // Similar logic to addAnswer, but mapping
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;
    const question = company.questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedAnswers = question.answers.map((a) =>
      a.id === answerId
        ? { ...a, content: newContent, updatedAt: new Date().toISOString() }
        : a,
    );

    // UI Update
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            questions: c.questions.map((q) => {
              if (q.id === questionId) {
                return { ...q, answers: updatedAnswers };
              }
              return q;
            }),
          };
        }
        return c;
      }),
    );

    // DB Update
    await supabase
      .from('questions')
      .update({ answers: updatedAnswers })
      .eq('id', questionId);
  };

  // Helper
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
    isLoading,
  };
}
