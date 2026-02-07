'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchTrigger } from '@/components/SearchTrigger';
import { LogOut, LayoutGrid } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '64px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid hsl(var(--border))',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0, // Reset glass radius
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'hsl(var(--text-main))',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          <div
            style={{
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayoutGrid size={20} />
          </div>
          <span>Interview Recorder</span>
        </Link>
      </div>

      {/* Center: Search (Visible on Desktop) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <SearchTrigger />
        </div>
      </div>

      {/* Right: User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <span
            className="desktop-only"
            style={{
              fontSize: '0.875rem',
              color: 'hsl(var(--text-muted))',
            }}
          >
            {user.email.split('@')[0]}님
          </span>
        )}

        <ThemeToggle />

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'hsl(var(--text-muted))',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          title="로그아웃"
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'hsl(var(--primary))')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'hsl(var(--text-muted))')
          }
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
