import React from 'react';

export interface RetroWindowProps {
  title: string;
  badge?: string;
  variant?: 'purple' | 'cream' | 'dark';
  children: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  badge,
  variant = 'purple',
  children,
  action,
  style,
  className = '',
}) => {
  const isCream = variant === 'cream';
  const isDark = variant === 'dark';

  const containerBg = isCream
    ? 'var(--card-cream)'
    : isDark
    ? 'var(--bg-panel-dark)'
    : 'var(--bg-panel-purple)';

  const containerText = isCream ? 'var(--text-dark)' : 'var(--text-primary)';
  const border = isCream ? '2px solid var(--border-cream)' : '2px solid var(--border-purple)';
  const shadow = isCream ? 'var(--retro-shadow-cream)' : 'var(--retro-shadow)';

  const titleBarBg = isCream ? 'var(--card-cream-dark)' : 'var(--bg-deep-indigo)';
  const titleBarText = isCream ? 'var(--text-dark)' : 'var(--accent-gold)';

  return (
    <section
      className={`retro-window ${className}`}
      style={{
        backgroundColor: containerBg,
        color: containerText,
        border: border,
        borderRadius: '6px',
        boxShadow: shadow,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Retro Window Header / Title Bar */}
      <div
        style={{
          backgroundColor: titleBarBg,
          color: titleBarText,
          padding: '0.45rem 0.85rem',
          borderBottom: border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Decorative Window Controls */}
          <div style={{ display: 'flex', gap: '4px' }} aria-hidden="true">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff792f', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbe3b', display: 'inline-block' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#20b8b0', display: 'inline-block' }} />
          </div>
          <span>{title}</span>
          {badge && (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.1rem 0.4rem',
                backgroundColor: 'rgba(255, 121, 47, 0.2)',
                color: 'var(--accent-orange)',
                borderRadius: '3px',
                border: '1px solid var(--accent-orange)',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.25rem', flex: 1 }}>{children}</div>
    </section>
  );
};
