import React from 'react';
import { ornaments } from '../../assets';
import { PosterAssetImage } from '../poster/PosterAssetImage';

export interface PosterBannerProps {
  title?: string;
  className?: string;
}

export const PosterBanner: React.FC<PosterBannerProps> = ({ title, className = '' }) => {
  return (
    <div
      className={`poster-banner-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 760,
        margin: '0 auto',
        padding: '0.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 540 }}>
        <PosterAssetImage asset={ornaments.headerCrest} style={{ margin: '0 auto' }} />
      </div>
      {title && (
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--saffron-gold)',
            textShadow: '2px 2px 0px #000',
            letterSpacing: '0.06em',
            marginTop: '-0.5rem',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export const PosterRibbonDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`poster-ribbon-divider ${className}`}
      style={{
        width: '100%',
        maxWidth: 820,
        margin: '1.5rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
      }}
    >
      <PosterAssetImage
        asset={ornaments.dividerRibbon}
        style={{ width: '100%', maxHeight: 48, objectFit: 'contain' }}
      />
    </div>
  );
};
