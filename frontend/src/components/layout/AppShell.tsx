import React from 'react';

export interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: '📺', active: activeTab === 'dashboard' },
    { id: 'profile', label: 'Creator Profile', icon: '👤', active: activeTab === 'profile' },
    { id: 'schedule', label: 'Topic Schedule', icon: '📅', active: activeTab === 'schedule' },
    { id: 'packages', label: 'Content Packages', icon: '📦', active: activeTab === 'packages', planned: true },
    { id: 'media', label: 'Media Upload', icon: '📼', active: activeTab === 'media', planned: true },
    { id: 'youtube', label: 'YouTube Studio', icon: '🚀', active: activeTab === 'youtube', planned: true },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner / System Title Bar */}
      <header
        style={{
          backgroundColor: 'var(--bg-deep-indigo)',
          borderBottom: '2px solid var(--border-purple)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }} role="img" aria-label="retro studio">👾</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: 'var(--accent-orange)',
                  letterSpacing: '0.02em',
                }}
              >
                AUTONOMOUS YOUTUBE AGENT
              </h1>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  backgroundColor: 'var(--card-cream)',
                  color: 'var(--text-dark)',
                  borderRadius: '3px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                RETRO STUDIO v0.2.0
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              MAKE VIDEOS. SHIP STORIES. // ZERO-PAID-API ARCHITECTURE
            </p>
          </div>
        </div>

        {/* Global studio indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            MODE: <strong style={{ color: 'var(--accent-teal)' }}>LOCAL DEV</strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            ENV: <strong style={{ color: 'var(--accent-gold)' }}>PHASE 1</strong>
          </span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        {/* Retro Side Navigation */}
        <nav
          style={{
            width: '240px',
            backgroundColor: 'var(--bg-panel-dark)',
            borderRight: '2px solid var(--border-purple)',
            padding: '1.25rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          aria-label="Studio Navigation"
        >
          <div style={{ padding: '0 0.5rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            // Navigation Matrix
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange && onTabChange(item.id)}
              disabled={item.planned}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                backgroundColor: item.active ? 'var(--bg-panel-purple)' : 'transparent',
                color: item.active ? 'var(--accent-orange)' : item.planned ? 'var(--text-muted)' : 'var(--text-primary)',
                border: item.active ? '1px solid var(--accent-orange)' : '1px solid transparent',
                borderRadius: '4px',
                textAlign: 'left',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                fontWeight: item.active ? 700 : 500,
                cursor: item.planned ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.planned && (
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', border: '1px solid var(--text-muted)', padding: '0 0.25rem', borderRadius: '2px' }}>
                  PHASE 2+
                </span>
              )}
            </button>
          ))}

          <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0', borderTop: '1px dashed var(--border-purple)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              ⚡ Budget: <strong style={{ color: 'var(--accent-teal)' }}>$0.00 / Free Tier</strong>
            </div>
          </div>
        </nav>

        {/* Content Viewport */}
        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
