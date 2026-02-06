'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ChevronRight,
  Trash2,
  Calendar,
  Link as LinkIcon,
  ArrowUpDown,
  Edit2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterviewData } from '@/hooks/useInterviewData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchTrigger } from '@/components/SearchTrigger';

import { Company } from '@/types';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { companies, addCompany, deleteCompany, updateCompany, isLoading } =
    useInterviewData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Track if editing

  const [companyName, setCompanyName] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [jobLink, setJobLink] = useState('');

  // Sorting State
  const [sortBy, setSortBy] = useState<
    'name' | 'deadline-soon' | 'deadline-late'
  >('name');

  const openAddModal = () => {
    setEditingId(null);
    setCompanyName('');
    setJobDate('');
    setJobLink('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, company: Company) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(company.id);
    setCompanyName(company.name);
    setJobDate(company.jobDate || '');
    setJobLink(company.jobLink || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      if (editingId) {
        updateCompany(editingId, companyName.trim(), jobDate, jobLink);
      } else {
        addCompany(companyName.trim(), jobDate, jobLink);
      }
      setIsModalOpen(false);
    }
  };

  const handleDeleteCompany = (
    e: React.MouseEvent,
    id: string,
    name: string,
  ) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    if (
      confirm(
        `'${name}' 기업을 삭제하시겠습니까? 관련된 모든 질문 내용이 삭제됩니다.`,
      )
    ) {
      deleteCompany(id);
    }
  };

  // Sorting Logic
  const sortedCompanies = [...companies].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'deadline-soon') {
      if (!a.jobDate) return 1;
      if (!b.jobDate) return -1;
      return a.jobDate.localeCompare(b.jobDate);
    } else {
      // deadline-late
      if (!a.jobDate) return 1;
      if (!b.jobDate) return -1;
      return b.jobDate.localeCompare(a.jobDate);
    }
  });

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container"
      style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
    >
      <div
        className="responsive-header"
        style={{
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {/* Top User Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: '0.9rem',
            gap: '1rem',
            borderBottom: '1px solid hsl(var(--border))',
            paddingBottom: '0.5rem',
          }}
        >
          <span style={{ color: 'hsl(var(--text-muted))' }}>
            {user?.email?.split('@')[0]}님 환영합니다
          </span>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'hsl(var(--primary))',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            로그아웃
          </button>
        </div>

        {/* Main Header Content */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1
              className="gradient-text"
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
              }}
            >
              면접 질문 기록
            </h1>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1.1rem' }}>
              받았던 질문을 기록하고, 완벽한 답변을 준비하세요.
            </p>
          </div>

          {/* Actions Row */}
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <SearchTrigger />

            {/* Sort Control */}
            <div
              className="dropdown-container"
              style={{ position: 'relative' }}
            >
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'name'
                      | 'deadline-soon'
                      | 'deadline-late',
                  )
                }
                style={{
                  appearance: 'none',
                  background: 'hsl(var(--surface))',
                  border: '1px solid hsl(var(--border))',
                  padding: '0.6rem 2rem 0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  color: 'hsl(var(--text-main))',
                  cursor: 'pointer',
                  height: '40px',
                }}
              >
                <option value="name">이름순</option>
                <option value="deadline-soon">마감임박순</option>
                <option value="deadline-late">마감여유순</option>
              </select>
              <ArrowUpDown
                size={14}
                style={{
                  position: 'absolute',
                  right: '0.7rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'hsl(var(--text-muted))',
                }}
              />
            </div>

            <ThemeToggle />
            <Button onClick={openAddModal}>
              <Plus size={20} />
              기업 추가
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="glass"
              style={{
                height: '200px',
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
          ))}
        </div>
      ) : companies.length === 0 ? (
        <Card
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            borderStyle: 'dashed',
            background: 'transparent',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'hsl(var(--surface))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'hsl(var(--primary))',
            }}
          >
            <Plus size={32} />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            아직 등록된 기업이 없습니다
          </h3>
          <p
            style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem' }}
          >
            면접을 진행 중인 기업을 추가해보세요.
          </p>
          <Button variant="secondary" onClick={openAddModal}>
            첫 번째 기업 추가하기
          </Button>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {sortedCompanies.map((company) => (
            <motion.div
              layout // Animate reordering
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={`/company/${company.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  hoverable
                  className="glass"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        marginBottom: '0',
                        color: 'hsl(var(--text-main))',
                      }}
                    >
                      {company.name}
                    </h3>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      <button
                        onClick={(e) => openEditModal(e, company)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'hsl(var(--text-muted))',
                          cursor: 'pointer',
                          padding: '0.4rem',
                          opacity: 0.6,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = '1')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = '0.6')
                        }
                        title="수정"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteCompany(e, company.id, company.name)
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'hsl(var(--text-muted))',
                          cursor: 'pointer',
                          padding: '0.4rem',
                          opacity: 0.6,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = '1')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = '0.6')
                        }
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Job Metadata Info */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      marginTop: '0.2rem',
                      marginBottom: '1rem',
                      fontSize: '0.9rem',
                      color: 'hsl(var(--text-muted))',
                    }}
                  >
                    {company.jobDate && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Calendar size={14} />
                        <span>{company.jobDate}</span>
                      </div>
                    )}
                    {company.jobLink && (
                      <div style={{ display: 'flex' }}>
                        <a
                          href={company.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Explicitly stop propagation
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: 'hsl(var(--primary))',
                            textDecoration: 'none',
                            background: 'hsl(var(--surface-hover))',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                          }}
                        >
                          <LinkIcon size={12} />
                          <span>공고 보기</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'hsl(var(--text-muted))',
                      fontSize: '0.875rem',
                    }}
                  >
                    <p>{company.questions.length}개의 질문</p>
                    <ChevronRight size={18} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? '기업 정보 수정' : '새로운 기업 추가'}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Input
              label="기업명 (필수)"
              placeholder="예: 구글, 아마존, 당근마켓"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoFocus
              required
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input
                type="date"
                label="채용 공고일 / 마감일 (선택)"
                value={jobDate}
                onChange={(e) => setJobDate(e.target.value)}
              />
            </div>
            <Input
              label="채용 공고 링크 (선택)"
              placeholder="https://..."
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
            />
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
            <Button type="submit">{editingId ? '수정하기' : '추가하기'}</Button>
          </div>
        </form>
      </Modal>
    </motion.main>
  );
}
