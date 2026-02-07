'use client';

import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { Question } from '@/types';

interface QuestionListSidebarProps {
  companyId: string;
  questions: Question[];
  currentQuestionId: string;
}

export function QuestionListSidebar({
  companyId,
  questions,
  currentQuestionId,
}: QuestionListSidebarProps) {
  return (
    <aside
      className="glass"
      style={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid hsl(var(--border))',
        background: 'hsl(var(--surface) / 0.5)',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)', // Round left corners only if standalone, but typically sidebar is straight
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid hsl(var(--border))',
          background: 'hsl(var(--surface) / 0.8)',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>질문 목록</h3>
        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
          {questions.filter((q) => q.answers.length > 0).length} /{' '}
          {questions.length} 완료
        </p>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {questions.map((q, index) => {
          const isCurrent = q.id === currentQuestionId;
          const isAnswered = q.answers.length > 0;

          return (
            <Link
              key={q.id}
              href={`/company/${companyId}/question/${q.id}`}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent
                  ? 'hsl(var(--primary) / 0.1)'
                  : 'transparent',
                color: isCurrent
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--text-main))',
                transition: 'background 0.2s',
                fontSize: '0.9rem',
                lineHeight: 1.4,
              }}
            >
              <div style={{ marginTop: '0.1rem', flexShrink: 0 }}>
                {isAnswered ? (
                  <CheckCircle2
                    size={16}
                    color={
                      isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--success))'
                    }
                  />
                ) : (
                  <Circle
                    size={16}
                    color="hsl(var(--text-muted))"
                    style={{ opacity: 0.5 }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontWeight: 600,
                    marginRight: '0.4rem',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                  }}
                >
                  Q{q.order || index + 1}
                </span>
                <span
                  style={{
                    color: isCurrent ? 'inherit' : 'hsl(var(--text-muted))',
                  }}
                >
                  {q.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
