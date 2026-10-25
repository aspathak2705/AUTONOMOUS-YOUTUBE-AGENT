import React from 'react';

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'orange' | 'teal' | 'purple' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'orange',
  size = 'md',
  children,
  style,
  disabled,
  className = '',
  ...props
}) => {
  let bg = 'var(--accent-orange)';
  let color = '#ffffff';
  let border = '2px solid #120b29';
  let shadow = 'var(--retro-shadow-sm)';

  if (variant === 'teal') {
    bg = 'var(--accent-teal)';
    color = '#0c2423';
  } else if (variant === 'purple') {
    bg = 'var(--bg-panel-purple)';
    color = 'var(--text-primary)';
    border = '2px solid var(--border-purple)';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = 'var(--text-secondary)';
    border = '1px dashed var(--border-purple)';
    shadow = 'none';
  }

  const padding = size === 'sm' ? '0.25rem 0.6rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem';
  const fontSize = size === 'sm' ? '0.8rem' : size === 'lg' ? '1rem' : '0.875rem';

  return (
    <button
      className={`pixel-btn ${className}`}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#3b335c' : bg,
        color: disabled ? '#8b7fa8' : color,
        border: border,
        boxShadow: disabled ? 'none' : shadow,
        padding: padding,
        fontSize: fontSize,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.02em',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        textTransform: 'uppercase',
        transition: 'transform 0.05s ease, box-shadow 0.05s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
