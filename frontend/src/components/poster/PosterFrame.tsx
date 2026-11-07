import React from 'react';
import { OrnateCorner } from '../illustrations/OrnateMotifs';

export interface PosterFrameProps {
  children: React.ReactNode;
  variant?: 'cream' | 'indigo' | 'turquoise' | 'vermilion';
  title?: string;
  badge?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hasCorners?: boolean;
}

export const PosterFrame: React.FC<PosterFrameProps> = ({
  children,
  variant = 'cream',
  title,
  badge,
  action,
  style,
  className = '',
  hasCorners = true,
}) => {
  // Styles based on Indian vintage lithograph color combinations
  let bg = 'var(--warm-cream)';
  let textColor = 'var(--text-on-cream)';
  let borderColor = 'var(--dark-outline)';
  let headerBg = 'var(--antique-paper)';
  let headerTextColor = 'var(--dark-outline)';
  let shadow = 'var(--poster-shadow)';

  if (variant === 'indigo') {
    bg = 'var(--ink-navy)';
    textColor = 'var(--text-on-dark)';
    borderColor = 'var(--saffron-gold)';
    headerBg = 'var(--ornamental-indigo)';
    headerTextColor = 'var(--saffron-gold)';
    shadow = 'var(--poster-shadow-gold)';
  } else if (variant === 'turquoise') {
    bg = 'var(--rich-turquoise)';
    textColor = '#FFFFFF';
    borderColor = 'var(--dark-outline)';
    headerBg = '#056b84';
    headerTextColor = '#FFFFFF';
  } else if (variant === 'vermilion') {
    bg = 'var(--vermilion)';
    textColor = '#FFFFFF';
    borderColor = 'var(--dark-outline)';
    headerBg = '#b82a22';
    headerTextColor = 'var(--saffron-gold)';
  }

  return (
    <div
      className={`poster-frame ${className}`}
      style={{
        backgroundColor: bg,
        color: textColor,
        border: `3px solid ${borderColor}`,
        borderRadius: '8px',
        boxShadow: shadow,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
    >
      {hasCorners && (
        <>
          <OrnateCorner position="top-left" color={variant === 'indigo' ? '#F4A928' : '#D93B32'} />
          <OrnateCorner position="top-right" color={variant === 'indigo' ? '#F4A928' : '#D93B32'} />
        </>
      )}

      {/* Ornate Header Banner */}
      {title && (
        <div
          style={{
            backgroundColor: headerBg,
            color: headerTextColor,
            padding: '0.65rem 1.25rem',
            borderBottom: `3px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            letterSpacing: '0.04em',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'var(--vermilion)', fontSize: '1rem' }}>✦</span>
            <span>{title}</span>
            {badge && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  backgroundColor: 'var(--vermilion)',
                  color: '#FFFFFF',
                  borderRadius: '2px',
                  border: '1px solid var(--dark-outline)',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Main Container Content */}
      <div style={{ padding: '1.25rem', flex: 1, position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};
