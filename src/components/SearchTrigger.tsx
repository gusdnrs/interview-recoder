'use client';

import { Search } from 'lucide-react';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';
import { SearchOverlay } from './SearchOverlay';

export const SearchTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        style={{
          color: 'hsl(var(--text-muted))',
          justifyContent: 'space-between',
          minWidth: '200px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} />
          <span style={{ fontWeight: 400 }}>검색하기...</span>
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            background: 'hsl(var(--border))',
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
          }}
        >
          /
        </span>
      </Button>
      <SearchOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
