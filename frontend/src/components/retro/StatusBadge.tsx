import React from 'react';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  dot = true,
}) => {
  let color = 'var(--text-secondary)';
  let bg = 'rgba(169, 155, 207, 0.15)';
  let border = '1px solid var(--border-purple)';

  if (status === 'success') {
    color = 'var(--status-success)';
    bg = 'var(--status-success-bg)';
    border = '1px solid var(--status-success)';
  } else if (status === 'warning') {
    color = 'var(--status-warning)';
    bg = 'var(--status-warning-bg)';
    border = '1px solid var(--status-warning)';
  } else if (status === 'error') {
    color = 'var(--status-error)';
    bg = 'var(--status-error-bg)';
    border = '1px solid var(--status-error)';
  } else if (status === 'info') {
    color = 'var(--status-info)';
    bg = 'var(--status-info-bg)';
    border = '1px solid var(--status-info)';
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
        letterSpacing: '0.04em',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block',
          }}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
};
