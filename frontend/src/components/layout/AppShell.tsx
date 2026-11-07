import React from 'react';
import { OrnatePlayMedallion } from '../illustrations/OrnateMotifs';

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
    { id: 'dashboard', label: 'Studio Home', icon: '📺', active: activeTab === 'dashboard' },
    { id: 'profile', label: 'Creator Profile', icon: '✦', active: activeTab === 'profile' },
    { id: 'schedule', label: 'Topic Schedule', icon: '📅', active: activeTab === 'schedule' },
    { id: 'packages', label: 'Content Workspace', icon: '📦', active: activeTab === 'packages', planned: true },
    { id: 'media', label: 'Media Upload', icon: '📼', active: activeTab === 'media', planned: true },
    { id: 'youtube', label: 'Publishing Calendar', icon: '🚀', active: activeTab === 'youtube', planned: true },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ornate Header Banner */}
      <header
        style={{
          backgroundColor: 'var(--ink-navy)',
          borderBottom: '4px solid var(--saffron-gold)',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <OrnatePlayMedallion size={46} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--saffron-gold)',
                  letterSpacing: '0.04em',
                  textShadow: '2px 2px 0px #24152C',
                }}
              >
                AUTONOMOUS YOUTUBE AGENT
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  backgroundColor: 'var(--vermilion)',
                  color: '#FFFFFF',
                  borderRadius: '2px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  border: '1px solid var(--saffron-gold)',
                }}
              >
                CREATOR EDITION
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: 'var(--antique-paper)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}
            >
              PREMIUM ILLUSTRATED WORKSPACE // ZERO-PAID-API ARCHITECTURE
            </p>
          </div>
        </div>

        {/* Global Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
          <div
            style={{
              padding: '0.35rem 0.75rem',
              backgroundColor: 'rgba(244, 169, 40, 0.15)',
              border: '1px solid var(--saffron-gold)',
              borderRadius: '4px',
              color: 'var(--saffron-bright)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--festival-teal)', display: 'inline-block' }} />
            <span>STUDIO WORKSPACE ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        {/* Ornate Sidebar Navigation */}
        <nav
          style={{
            width: '260px',
            backgroundColor: 'var(--ornamental-indigo)',
            borderRight: '3px solid var(--dark-outline)',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            boxShadow: '4px 0px 0px rgba(0,0,0,0.3)',
          }}
          aria-label="Studio Navigation"
        >
          <div
            style={{
              padding: '0 0.5rem 0.5rem',
              fontSize: '0.75rem',
              color: 'var(--saffron-gold)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              borderBottom: '1px dashed rgba(244, 169, 40, 0.3)',
              marginBottom: '0.5rem',
            }}
          >
            ✦ NAVIGATION MATRIX
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
                padding: '0.75rem 0.9rem',
                backgroundColor: item.active ? 'var(--saffron-gold)' : 'transparent',
                color: item.active ? 'var(--dark-outline)' : item.planned ? '#726786' : 'var(--text-on-dark)',
                border: item.active ? '2px solid var(--dark-outline)' : '2px solid transparent',
                borderRadius: '6px',
                textAlign: 'left',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.03em',
                cursor: item.planned ? 'not-allowed' : 'pointer',
                boxShadow: item.active ? '3px 3px 0px var(--dark-outline)' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.planned && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#8b80a1',
                    border: '1px solid #4a3e62',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '3px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  SOON
                </span>
              )}
            </button>
          ))}

          <div
            style={{
              marginTop: 'auto',
              padding: '1rem 0.75rem',
              backgroundColor: 'var(--ink-navy)',
              border: '2px solid var(--saffron-gold)',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ color: 'var(--antique-paper)', marginBottom: '0.25rem' }}>BUDGET GUARANTEE:</div>
            <div style={{ color: 'var(--festival-teal)', fontWeight: 700 }}>$0.00 FREE TIER GATEWAY</div>
          </div>
        </nav>

        {/* Content Viewport */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
