import React from 'react';

export interface PosterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'saffron' | 'vermilion' | 'turquoise' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const PosterButton: React.FC<PosterButtonProps> = ({
  variant = 'saffron',
  size = 'md',
  children,
  style,
  disabled,
  className = '',
  ...props
}) => {
  let bg = 'var(--saffron-gold)';
  let color = 'var(--dark-outline)';
  let border = '2px solid var(--dark-outline)';
  let shadow = '3px 3px 0px var(--dark-outline)';

  if (variant === 'vermilion') {
    bg = 'var(--vermilion)';
    color = '#FFFFFF';
  } else if (variant === 'turquoise') {
    bg = 'var(--rich-turquoise)';
    color = '#FFFFFF';
  } else if (variant === 'cream') {
    bg = 'var(--warm-cream)';
    color = 'var(--dark-outline)';
  }

  const padding = size === 'sm' ? '0.35rem 0.75rem' : size === 'lg' ? '0.75rem 1.6rem' : '0.55rem 1.15rem';
  const fontSize = size === 'sm' ? '0.8rem' : size === 'lg' ? '1rem' : '0.875rem';

  return (
    <button
      className={`poster-btn ${className}`}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#6b5e52' : bg,
        color: disabled ? '#d5cbbe' : color,
        border: border,
        boxShadow: disabled ? 'none' : shadow,
        padding: padding,
        fontSize: fontSize,
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        position: 'relative',
        transition: 'transform 0.08s ease, box-shadow 0.08s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translate(2px, 2px)';
          e.currentTarget.style.boxShadow = '1px 1px 0px var(--dark-outline)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = shadow;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = shadow;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
