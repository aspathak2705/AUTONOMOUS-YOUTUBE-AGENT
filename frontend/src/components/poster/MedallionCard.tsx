import React from 'react';
import { DualAsset } from '../../assets';
import { PosterAssetImage } from '../poster/PosterAssetImage';

interface MedallionCardProps {
  asset: DualAsset;
  title: string;
  badge?: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  accentColor?: string;
  planned?: boolean;
}

export const MedallionCard: React.FC<MedallionCardProps> = ({
  asset,
  title,
  badge,
  description,
  actionText,
  onAction,
  accentColor = 'var(--saffron-gold)',
  planned = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--ink-navy)',
        border: `3px solid ${accentColor}`,
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: 'var(--poster-shadow-gold)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="medallion-card-interactive"
    >
      {/* Background radial shimmer */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
              transition: 'transform 0.3s ease',
            }}
            className="medallion-icon-hover"
          >
            <PosterAssetImage asset={asset} width={56} height={56} loading="eager" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  color: 'var(--text-on-dark)',
                  letterSpacing: '0.04em',
                }}
              >
                {title}
              </h3>
              {badge && (
                <span
                  style={{
                    backgroundColor: planned ? 'rgba(255,255,255,0.1)' : 'var(--vermilion)',
                    color: planned ? 'var(--antique-paper)' : '#FFF',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <p
          style={{
            margin: '0 0 1rem 0',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--antique-paper)',
          }}
        >
          {description}
        </p>
      </div>

      {actionText && (
        <button
          onClick={onAction}
          disabled={planned}
          style={{
            backgroundColor: planned ? 'transparent' : accentColor,
            color: planned ? 'var(--antique-paper)' : 'var(--dark-outline)',
            border: planned ? '1px dashed rgba(255,255,255,0.3)' : '2px solid var(--dark-outline)',
            borderRadius: '4px',
            padding: '0.5rem 0.85rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: planned ? 'default' : 'pointer',
            textAlign: 'center',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: planned ? 'none' : '2px 2px 0px var(--dark-outline)',
          }}
        >
          <span>{actionText}</span>
          {!planned && <span>➔</span>}
        </button>
      )}
    </div>
  );
};
