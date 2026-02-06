'use client';

import React, { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';
import { Input } from './ui/Input';
import styles from './ui/Input.module.css';

interface CategoryInputProps {
  categories: string[];
  onChange: (categories: string[]) => void;
}

const PREDEFINED_CATEGORIES = [
  '자기소개',
  '성격장단점',
  '지원동기',
  '직무역량',
  '프로젝트',
  '갈등해결',
  '실패경험',
  '커뮤니케이션',
  'CS',
  '알고리즘',
  '인성',
];

export const CategoryInput = ({ categories, onChange }: CategoryInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory(inputValue);
    }
  };

  const addCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onChange([...categories, trimmed]);
      setInputValue('');
    }
  };

  const removeCategory = (cat: string) => {
    onChange(categories.filter((c) => c !== cat));
  };

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>카테고리</label>

      {/* Predefined Chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        {PREDEFINED_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => addCategory(cat)}
            disabled={categories.includes(cat)}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              border: '1px solid hsl(var(--border))',
              background: categories.includes(cat)
                ? 'hsl(var(--surface-hover))'
                : 'transparent',
              color: categories.includes(cat)
                ? 'hsl(var(--text-muted))'
                : 'hsl(var(--text-main))',
              cursor: categories.includes(cat) ? 'default' : 'pointer',
              opacity: categories.includes(cat) ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="직접 입력 (Enter로 추가)"
          style={{ marginBottom: 0 }}
        />
        <button
          type="button"
          onClick={() => addCategory(inputValue)}
          style={{
            background: 'hsl(var(--surface-hover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius-md)',
            padding: '0 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'hsl(var(--text-main))',
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {categories.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Hash size={12} />
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(cat)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'currentColor',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  marginLeft: '0.25rem',
                }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
