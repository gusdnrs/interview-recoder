'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ArrowLeft,
  MessageCircle,
  Trash2,
  Tag,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useInterviewData } from '@/hooks/useInterviewData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CategoryInput } from '@/components/CategoryInput';

interface CompanyDetailClientProps {
  id: string;
}

export function CompanyDetailClient({ id }: CompanyDetailClientProps) {
  const router = useRouter();
  const { getCompany, addQuestion, deleteQuestions, isLoading } =
    useInterviewData();
  const company = getCompany(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [questionOrder, setQuestionOrder] = useState<string>('');

  // New State for Limits
  const [limitType, setLimitType] = useState<'char' | 'byte' | 'none'>('none');
  const [limitCount, setLimitCount] = useState<string>('500');

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  if (isLoading) {
    return (
      <main
        className="container"
        style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '150px',
              height: '20px',
              background: 'hsl(var(--surface-hover))',
              marginBottom: '1.5rem',
              borderRadius: '4px',
            }}
          ></div>
          <div
            style={{
              width: '300px',
              height: '40px',
              background: 'hsl(var(--surface-hover))',
              marginBottom: '0.5rem',
              borderRadius: '4px',
            }}
          ></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="glass"
              style={{
                height: '80px',
                opacity: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className="loader"
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid hsl(var(--border))',
                  borderTopColor: 'hsl(var(--primary))',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main
        className="container"
        style={{ paddingTop: '3rem', textAlign: 'center' }}
      >
        <h1 style={{ marginBottom: '1rem' }}>기업을 찾을 수 없습니다</h1>
        <Button variant="secondary" onClick={() => router.push('/')}>
          <ArrowLeft size={16} /> 대시보드로 돌아가기
        </Button>
      </main>
    );
  }

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestionText.trim()) {
      const order = questionOrder ? parseInt(questionOrder, 10) : undefined;
      const finalLimitType = limitType === 'none' ? null : limitType;
      const finalLimitCount =
        limitType === 'none' ? undefined : parseInt(limitCount, 10);

      addQuestion(
        company.id,
        newQuestionText.trim(),
        categories,
        order,
        finalLimitType,
        finalLimitCount,
      );

      // Reset form
      setNewQuestionText('');
      setCategories([]);
      setQuestionOrder('');
      setLimitType('none');
      setLimitCount('500');
      setIsModalOpen(false);
    }
  };

  const toggleQuestionSelection = (qId: string) => {
    if (selectedQuestions.includes(qId)) {
      setSelectedQuestions((prev) => prev.filter((id) => id !== qId));
    } else {
      setSelectedQuestions((prev) => [...prev, qId]);
    }
  };

  const handleDeleteSelected = () => {
    if (
      confirm(`선택한 ${selectedQuestions.length}개의 질문을 삭제하시겠습니까?`)
    ) {
      deleteQuestions(company.id, selectedQuestions);
      setSelectedQuestions([]);
      setIsSelectionMode(false);
    }
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedQuestions([]);
    } else {
      setIsSelectionMode(true);
    }
  };

  return (
    <main
      className="container"
      style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        {/* Breadcrumb-like Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'hsl(var(--text-muted))',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'hsl(var(--text-main))', fontWeight: 500 }}>
            {company.name}
          </span>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Link href="/">
            <Button
              variant="ghost"
              style={{ paddingLeft: 0, color: 'hsl(var(--text-muted))' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />{' '}
              대시보드로 돌아가기
            </Button>
          </Link>
        </div>

        <div
          className="responsive-header"
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Company Title */}
          <div>
            <h1
              className="gradient-text"
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
              }}
            >
              {company.name}
            </h1>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                color: 'hsl(var(--text-muted))',
                fontSize: '1rem',
                alignItems: 'center',
              }}
            >
              <p>{company.questions.length}개의 질문</p>
              {/* Short Job Info display if exists */}
              {company.jobDate && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    background: 'hsl(var(--surface-hover))',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                  }}
                >
                  {company.jobDate}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            {/* Selection Mode Toggle or Delete Action */}
            {isSelectionMode ? (
              <>
                <Button variant="secondary" onClick={toggleSelectionMode}>
                  취소
                </Button>
                <Button
                  onClick={handleDeleteSelected}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                  }}
                  disabled={selectedQuestions.length === 0}
                >
                  <Trash2 size={18} /> 삭제 ({selectedQuestions.length})
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={toggleSelectionMode}
                style={{ color: 'hsl(var(--text-muted))' }}
                title="선택 삭제"
              >
                <CheckSquare size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Add Question Card - Always Visible First */}
        <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <Card
            hoverable
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              border: '2px dashed hsl(var(--border))',
              background: 'transparent',
              color: 'hsl(var(--text-muted))',
              gap: '0.8rem',
            }}
          >
            <Plus size={20} />
            <span style={{ fontWeight: 600 }}>새로운 질문 추가하기</span>
          </Card>
        </div>

        {company.questions
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((question) => {
            const isSelected = selectedQuestions.includes(question.id);
            return (
              <div
                key={question.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {/* Checkbox for Selection Mode */}
                {isSelectionMode && (
                  <div
                    onClick={() => toggleQuestionSelection(question.id)}
                    style={{
                      cursor: 'pointer',
                      color: isSelected
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--border))',
                    }}
                  >
                    {isSelected ? (
                      <CheckSquare size={24} />
                    ) : (
                      <Square size={24} />
                    )}
                  </div>
                )}

                <Link
                  href={`/company/${company.id}/question/${question.id}`}
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <Card
                    hoverable
                    className="glass"
                    style={{
                      border: isSelected
                        ? '1px solid hsl(var(--primary))'
                        : question.answers.length > 0
                          ? '1px solid hsl(var(--primary) / 0.4)'
                          : undefined,
                      background:
                        question.answers.length > 0
                          ? 'hsl(var(--surface-hover) / 0.5)'
                          : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          marginTop: '0.25rem',
                          color:
                            question.answers.length > 0
                              ? 'hsl(var(--primary))'
                              : 'hsl(var(--text-muted))',
                          flexShrink: 0,
                        }}
                      >
                        {question.answers.length > 0 ? (
                          <div
                            style={{
                              background: 'hsl(var(--primary) / 0.1)',
                              borderRadius: '50%',
                              padding: '0.4rem',
                              display: 'flex',
                            }}
                          >
                            <CheckSquare
                              size={20}
                              style={{ strokeWidth: 2.5 }}
                            />
                          </div>
                        ) : (
                          <MessageCircle size={24} style={{ opacity: 0.5 }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          {question.answers.length > 0 && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                                padding: '0.1rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              작성완료
                            </span>
                          )}

                          {question.order && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: 'hsl(var(--surface-hover))', // Tuned down for order
                                color: 'hsl(var(--text-main))',
                                border: '1px solid hsl(var(--border))',
                                padding: '0.1rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              Q{question.order}
                            </span>
                          )}

                          {question.categories &&
                            question.categories.map((cat) => (
                              <span
                                key={cat}
                                style={{
                                  fontSize: '0.75rem',
                                  background: 'hsl(var(--surface-hover))',
                                  padding: '0.1rem 0.5rem',
                                  borderRadius: 'var(--radius-full)',
                                  color: 'hsl(var(--text-muted))',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Tag size={10} /> {cat}
                              </span>
                            ))}

                          {/* Limit Badge */}
                          {question.limitType && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                border: '1px solid hsl(var(--border))',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                color: 'hsl(var(--text-muted))',
                              }}
                            >
                              {question.limitCount}
                              {question.limitType === 'char'
                                ? '자'
                                : 'byte'}{' '}
                              제한
                            </span>
                          )}
                        </div>
                        <h3
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            lineHeight: 1.4,
                            color:
                              question.answers.length > 0
                                ? 'hsl(var(--text-main))'
                                : 'hsl(var(--text-muted))', // Gray out unanswered title slightly? No, keep clear.
                          }}
                        >
                          {question.text}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '0.875rem',
                            color: 'hsl(var(--text-muted))',
                          }}
                        >
                          <span
                            style={{
                              color:
                                question.answers.length > 0
                                  ? 'hsl(var(--primary))'
                                  : 'inherit',
                              fontWeight:
                                question.answers.length > 0 ? 600 : 400,
                            }}
                          >
                            {question.answers.length}개의 답변
                          </span>
                          <span>•</span>
                          <span>
                            등록일{' '}
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'hsl(var(--primary))',
                          alignSelf: 'center',
                        }}
                      >
                        <ArrowLeft
                          size={20}
                          style={{ transform: 'rotate(180deg)' }}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="면접 질문 추가"
      >
        <form onSubmit={handleAddQuestion}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Added Sequence Number Input */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '80px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    color: 'hsl(var(--text-main))',
                  }}
                >
                  순서
                </label>
                <Input
                  type="number"
                  placeholder="No."
                  value={questionOrder}
                  onChange={(e) => setQuestionOrder(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    color: 'hsl(var(--text-main))',
                  }}
                >
                  질문 내용
                </label>
                <Input
                  placeholder="예: 가장 힘들었던 경험에 대해 말해보세요..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  autoFocus
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>

            {/* Limit Inputs */}
            <div
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}
            >
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    color: 'hsl(var(--text-main))',
                  }}
                >
                  글자수 제한 설정
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['none', 'char', 'byte'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLimitType(type)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border:
                          limitType === type
                            ? '1px solid hsl(var(--primary))'
                            : '1px solid hsl(var(--border))',
                        background:
                          limitType === type
                            ? 'hsl(var(--primary))'
                            : 'transparent',
                        color:
                          limitType === type
                            ? 'hsl(var(--primary-foreground))'
                            : 'hsl(var(--text-muted))',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      {type === 'none'
                        ? '없음'
                        : type === 'char'
                          ? '글자수'
                          : '바이트'}
                    </button>
                  ))}
                </div>
              </div>

              {limitType !== 'none' && (
                <div style={{ width: '120px' }}>
                  <Input
                    type="number"
                    value={limitCount}
                    onChange={(e) => setLimitCount(e.target.value)}
                    placeholder="제한 수"
                    min="1"
                    style={{ marginBottom: 0 }}
                  />
                </div>
              )}
            </div>

            <CategoryInput categories={categories} onChange={setCategories} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit">추가하기</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
