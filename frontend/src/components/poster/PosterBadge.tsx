import React from 'react';

export interface PosterBadgeProps {
  status: 'active' | 'warning' | 'alert' | 'info' | 'gold';
  label: string;
}

export const PosterBadge: React.FC<PosterBadgeProps> = ({ status, label }) => {
  let bg = 'var(--saffron-gold)';
  let color = 'var(--dark-outline)';
  let border = '1px solid var(--dark-outline)';

  if (status === 'active') {
    bg = 'var(--festival-teal)';
    color = '#FFFFFF';
  } else if (status === 'alert') {
    bg = 'var(--vermilion)';
    color = '#FFFFFF';
  } else if (status === 'info') {
    bg = 'var(--rich-turquoise)';
    color = '#FFFFFF';
  } else if (status === 'warning') {
    bg = 'var(--saffron-gold)';
    color = 'var(--dark-outline)';
  } else if (status === 'gold') {
    bg = 'var(--saffron-gold)';
    color = 'var(--dark-outline)';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.55rem',
        borderRadius: '3px',
        backgroundColor: bg,
        color: color,
        border: border,
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '1px 1px 0px rgba(0,0,0,0.3)',
      }}
    >
      <span style={{ fontSize: '0.65rem' }}>✦</span>
      {label}
    </span>
  );
};
