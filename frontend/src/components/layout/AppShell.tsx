import React from 'react';
import { medallions } from '../../assets';
import { PosterAssetImage } from '../poster/PosterAssetImage';
import { PosterBanner } from '../poster/PosterBanner';

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
    { id: 'dashboard', label: 'Studio Home', iconAsset: medallions.goldSun, active: activeTab === 'dashboard' },
    { id: 'profile', label: 'Creator Profile', iconAsset: medallions.tealLotus, active: activeTab === 'profile' },
    { id: 'schedule', label: 'Topic Schedule', iconAsset: medallions.rubyShield, active: activeTab === 'schedule' },
    { id: 'packages', label: 'Content Workspace', iconAsset: medallions.saffronMandala, active: activeTab === 'packages', planned: true },
    { id: 'media', label: 'Media Upload', iconAsset: medallions.peacockWheel, active: activeTab === 'media', planned: true },
    { id: 'youtube', label: 'Publishing Calendar', iconAsset: medallions.emeraldStar, active: activeTab === 'youtube', planned: true },
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
          <div style={{ width: 44, height: 44, flexShrink: 0 }}>
            <PosterAssetImage asset={medallions.goldSun} width={44} height={44} loading="eager" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  letterSpacing: '0.06em',
                  color: 'var(--saffron-gold)',
                  textShadow: '2px 2px 0px #000',
                }}
              >
                AUTONOMOUS YOUTUBE AGENT
              </span>
              <span
                style={{
                  backgroundColor: 'var(--vermilion)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--dark-outline)',
                  letterSpacing: '0.05em',
                }}
              >
                CREATOR EDITION
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--festival-teal)',
                letterSpacing: '0.08em',
              }}
            >
              RETRO LITHOGRAPH CREATOR STUDIO // $0-BUDGET ARCHITECTURE
            </div>
          </div>
        </div>

        {/* Global Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              backgroundColor: 'var(--ornamental-indigo)',
              border: '2px solid var(--festival-teal)',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--festival-teal)',
            }}
          >
            <span style={{ color: 'var(--saffron-gold)' }}>★</span>
            <span>OPENROUTER :FREE</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--ornamental-indigo)',
              border: '2px solid var(--saffron-gold)',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--saffron-gold)',
            }}
          >
            <span>SUPABASE POSTGRES</span>
          </div>
        </div>
      </header>

      {/* Main Lithograph Navigation Bar */}
      <nav
        style={{
          backgroundColor: 'var(--ornamental-indigo)',
          borderBottom: '3px solid var(--dark-outline)',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.3)',
        }}
        aria-label="Studio navigation"
      >
        {navItems.map((item) => {
          const isActive = item.active;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange && onTabChange(item.id)}
              disabled={item.planned}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isActive ? 'var(--saffron-gold)' : 'transparent',
                color: isActive ? 'var(--dark-outline)' : item.planned ? 'rgba(253, 246, 231, 0.4)' : 'var(--text-on-dark)',
                border: isActive ? '2px solid var(--dark-outline)' : '2px solid transparent',
                borderRadius: '6px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                cursor: item.planned ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '2px 2px 0px var(--dark-outline)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ width: 20, height: 20, display: 'inline-block' }}>
                <PosterAssetImage asset={item.iconAsset} width={20} height={20} loading="eager" />
              </span>
              <span>{item.label}</span>
              {item.planned && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'var(--antique-paper)',
                    padding: '1px 5px',
                    borderRadius: '3px',
                  }}
                >
                  SOON
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Primary Workspace Content View */}
      <main
        style={{
          flex: 1,
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      {/* Decorative Poster Footer with Header Arch Crest */}
      <footer
        style={{
          backgroundColor: 'var(--ink-navy)',
          borderTop: '4px solid var(--saffron-gold)',
          padding: '2.5rem 1.5rem',
          color: 'var(--antique-paper)',
          marginTop: 'auto',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            textAlign: 'center',
          }}
        >
          <PosterBanner />

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--saffron-gold)',
              letterSpacing: '0.06em',
            }}
          >
            AUTONOMOUS YOUTUBE AGENT // THE CREATOR EDITION
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--antique-paper)',
              maxWidth: '650px',
              lineHeight: 1.5,
            }}
          >
            Crafted for autonomous creators who command their own workflow. Zero paid LLM API model policy, PostgreSQL backend, and human-crafted video production integration.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--festival-teal)',
            }}
          >
            <span>FASTAPI + SQLALCHEMY</span>
            <span>✦</span>
            <span>OPENROUTER FREE GATEWAY</span>
            <span>✦</span>
            <span>YOUTUBE DATA API V3</span>
            <span>✦</span>
            <span>SUPABASE CLUSTER</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
