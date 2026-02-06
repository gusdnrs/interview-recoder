'use client';

import { useState, use, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewData } from '@/hooks/useInterviewData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Question, Company } from '@/types';
import styles from './page.module.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchTrigger } from '@/components/SearchTrigger';

export default function QuestionDetail({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const { id, qid } = use(params);
  const router = useRouter();
  const { getCompany, addAnswer, updateAnswer, isLoading } = useInterviewData();
  const company = getCompany(id);
  const question = company?.questions.find((q) => q.id === qid);

  const [answerText, setAnswerText] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // const [isWriterMode, setIsWriterMode] = useState(false); // Removed unused
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [answerText]);

  if (isLoading) {
    return (
      <main
        className={`container ${styles.container}`}
        style={{ paddingTop: '2rem', height: 'calc(100vh - 6rem)' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '200px',
              height: '20px',
              background: 'hsl(var(--surface-hover))',
              marginBottom: '1rem',
              borderRadius: '4px',
            }}
          ></div>
          <div
            style={{
              width: '60%',
              height: '30px',
              background: 'hsl(var(--surface-hover))',
              borderRadius: '4px',
            }}
          ></div>
        </div>
        <Card
          className="glass"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
          }}
        >
          <div
            className="loader"
            style={{
              width: '30px',
              height: '30px',
              border: '3px solid hsl(var(--border))',
              borderTopColor: 'hsl(var(--primary))',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </Card>
      </main>
    );
  }

  if (!company || !question) {
    return <div>질문을 찾을 수 없습니다</div>;
  }

  const hasAnswers = question.answers.length > 0;

  // Logic: Show writer ONLY if no answers exist.
  // If answers exist, force "Reader Mode" and HIDE the writer toggle.
  const showWriter = !hasAnswers;

  const handleSaveAnswer = () => {
    if (answerText.trim()) {
      addAnswer(company.id, question.id, answerText.trim());
      setAnswerText('');
      // setIsWriterMode(false); // No longer needed as layout is data-driven
    }
  };

  const startEditing = (answerId: string, currentContent: string) => {
    setEditingAnswerId(answerId);
    setEditContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingAnswerId(null);
    setEditContent('');
  };

  const saveEdit = (answerId: string) => {
    if (editContent.trim()) {
      updateAnswer(company.id, question.id, answerId, editContent.trim());
      setEditingAnswerId(null);
      setEditContent('');
    }
  };

  // Helper for counts
  const getByteLength = (s: string) => {
    let b = 0,
      i = 0,
      c;
    for (; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  };

  // Helper for Date YYYY.MM.DD
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;
  };

  const currentCount =
    question.limitType === 'byte'
      ? getByteLength(answerText)
      : answerText.length;
  const editCount =
    question.limitType === 'byte'
      ? getByteLength(editContent)
      : editContent.length;
  const maxCount = question.limitCount || 0;
  const isOverLimit = maxCount > 0 && currentCount > maxCount;

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`container ${styles.container}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 6rem)',
        paddingTop: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: '1.5rem' }}>
        <div
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <Link
              href={`/company/${id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'hsl(var(--text-muted))',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              <ArrowLeft size={16} /> {company.name} (으)로 돌아가기
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <SearchTrigger />
            <ThemeToggle />
          </div>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>
          <span
            style={{
              fontSize: '1rem',
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              padding: '0.1rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              marginRight: '0.75rem',
              verticalAlign: 'middle',
            }}
          >
            Q{question.order ?? '?'}
          </span>
          {question.text}

          {/* Limit Badge in Header */}
          {question.limitType && (
            <span
              style={{
                fontSize: '0.8rem',
                border: '1px solid hsl(var(--border))',
                padding: '0.1rem 0.5rem',
                borderRadius: '4px',
                marginLeft: '0.75rem',
                verticalAlign: 'middle',
                color: 'hsl(var(--text-muted))',
                fontWeight: 400,
              }}
            >
              {question.limitCount}
              {question.limitType === 'char' ? '자' : 'byte'} 제한
            </span>
          )}
        </h1>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflow: 'hidden',
        }}
      >
        {/* WRITER AREA - Only shown when NO answers exist */}
        {showWriter && (
          <motion.div
            layout
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card
              className="glass"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  flexShrink: 0,
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  새 답변 작성
                </h3>
              </div>

              {/* Scrollable Container for Textarea */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="답변 내용을 작성하세요..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    resize: 'none',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: 'hsl(var(--text-main))',
                  }}
                  autoFocus
                />
              </div>

              {/* Footer with Counter and Save */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid hsl(var(--border))',
                  flexShrink: 0,
                }}
              >
                {question.limitType ? (
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isOverLimit ? '#ef4444' : 'hsl(var(--text-muted))',
                    }}
                  >
                    {currentCount.toLocaleString()} /{' '}
                    {maxCount.toLocaleString()}{' '}
                    {question.limitType === 'char' ? '자' : 'byte'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'hsl(var(--text-muted))',
                    }}
                  >
                    {getByteLength(answerText).toLocaleString()} byte (
                    {answerText.length}자)
                  </span>
                )}

                <Button
                  onClick={handleSaveAnswer}
                  disabled={!answerText.trim() || isOverLimit}
                >
                  <Save size={18} /> 답변 저장
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ANSWER VIEW AREA - Shown when answers exist (effectively Single Answer mode if user only adds one) */}
        {!showWriter && hasAnswers && (
          <motion.div
            layout
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingBottom: '1rem',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <h3
                style={{
                  color: 'hsl(var(--text-muted))',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                내가 작성한 답변
              </h3>

              {[...question.answers].reverse().map((ans) => {
                const ansLen = ans.content.length;
                const ansByte = getByteLength(ans.content);

                return (
                  <motion.div
                    key={ans.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      style={{
                        background: 'hsl(var(--surface))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      {editingAnswerId === ans.id ? (
                        <div>
                          <textarea
                            value={editContent}
                            onChange={(e) => {
                              setEditContent(e.target.value);
                              // Auto grow
                              e.target.style.height = 'auto';
                              e.target.style.height =
                                e.target.scrollHeight + 'px';
                            }}
                            style={{
                              width: '100%',
                              minHeight: '200px',
                              marginBottom: '1rem',
                              fontFamily: 'monospace',
                              fontSize: '1rem',
                              lineHeight: 1.6,
                              resize: 'none',
                              background: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem',
                              color: 'hsl(var(--text-main))',
                            }}
                            autoFocus
                          />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            {/* Edit Counter */}
                            {question.limitType ? (
                              <span
                                style={{
                                  fontSize: '0.8rem',
                                  color:
                                    maxCount > 0 && editCount > maxCount
                                      ? '#ef4444'
                                      : 'hsl(var(--text-muted))',
                                }}
                              >
                                {editCount.toLocaleString()} /{' '}
                                {maxCount.toLocaleString()}{' '}
                                {question.limitType === 'char' ? '자' : 'byte'}
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'hsl(var(--text-muted))',
                                }}
                              >
                                {editCount.toLocaleString()} byte (
                                {editContent.length}자)
                              </span>
                            )}

                            <div
                              style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginLeft: 'auto',
                              }}
                            >
                              <Button
                                variant="secondary"
                                onClick={cancelEditing}
                              >
                                <X size={16} /> 취소
                              </Button>
                              <Button
                                onClick={() => saveEdit(ans.id)}
                                disabled={maxCount > 0 && editCount > maxCount}
                              >
                                <Save size={16} /> 수정 완료
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '1rem',
                              borderBottom:
                                '1px solid hsl(var(--border-light))',
                              paddingBottom: '0.75rem',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'hsl(var(--text-muted))',
                                fontSize: '0.85rem',
                              }}
                            >
                              <span>
                                {formatDate(ans.updatedAt || ans.createdAt)}
                              </span>
                              <span
                                style={{
                                  width: '1px',
                                  height: '10px',
                                  background: 'hsl(var(--border))',
                                }}
                              ></span>
                              <span>
                                {ansByte.toLocaleString()} byte (
                                {ansLen.toLocaleString()}자)
                              </span>
                            </div>

                            <Button
                              variant="secondary"
                              onClick={() => startEditing(ans.id, ans.content)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                height: 'auto',
                                fontSize: '0.85rem',
                              }}
                            >
                              <Edit2
                                size={14}
                                style={{ marginRight: '0.4rem' }}
                              />{' '}
                              수정
                            </Button>
                          </div>
                          <div
                            style={{
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.7,
                              fontSize: '1rem',
                              padding: '0.5rem 0',
                            }}
                          >
                            {ans.content}
                          </div>
                        </>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
