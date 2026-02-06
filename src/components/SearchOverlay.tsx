'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Briefcase, MessageCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewData } from '@/hooks/useInterviewData';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import styles from './ui/Modal.module.css'; // Reusing modal styles for overlay

export const SearchOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { companies } = useInterviewData();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    interface SearchResult {
      type: 'company' | 'question' | 'category';
      id: string;
      title: string;
      subtitle: string;
      icon: React.ReactNode;
      url: string;
    }
    const searchResults: SearchResult[] = [];

    companies.forEach((company) => {
      // Match Company Name
      if (company.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'company',
          id: company.id,
          title: company.name,
          subtitle: '기업',
          icon: <Briefcase size={16} />,
          url: `/company/${company.id}`,
        });
      }

      company.questions.forEach((q) => {
        // Match Question Text
        if (q.text.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'question',
            id: q.id,
            title: q.text,
            subtitle: `${company.name} • 질문`,
            icon: <MessageCircle size={16} />,
            url: `/company/${company.id}/question/${q.id}`,
          });
        }

        // Match Categories
        if (
          q.categories &&
          q.categories.some((c) => c.toLowerCase().includes(lowerQuery))
        ) {
          searchResults.push({
            type: 'category',
            id: q.id + '_cat',
            title: q.text,
            subtitle: `${company.name} • 카테고리 매칭`,
            icon: <Tag size={16} />,
            url: `/company/${company.id}/question/${q.id}`,
          });
        }
      });
    });

    return searchResults.slice(0, 10);
  }, [query, companies]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlay}
          style={{ alignItems: 'flex-start', paddingTop: '10vh' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={styles.modal}
            style={{ width: '600px', maxWidth: '90%' }}
          >
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid hsl(var(--border))',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Search size={20} color="hsl(var(--text-muted))" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기업, 질문, 카테고리 검색..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.1rem',
                  outline: 'none',
                  color: 'hsl(var(--text-main))',
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'hsl(var(--text-muted))',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {results.length > 0 ? (
                <div style={{ padding: '0.5rem' }}>
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        router.push(result.url);
                        onClose();
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          'hsl(var(--surface-hover))')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      <div
                        style={{
                          color: 'hsl(var(--text-muted))',
                          background: 'hsl(var(--surface-hover))',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {result.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                          {result.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'hsl(var(--text-muted))',
                          }}
                        >
                          {result.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() ? (
                <div
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'hsl(var(--text-muted))',
                  }}
                >
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'hsl(var(--text-muted))',
                    fontSize: '0.9rem',
                  }}
                >
                  찾고 싶은 내용을 입력하세요.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
