import React from 'react';
import { OrnatePlayMedallion } from '../illustrations/OrnateMotifs';
import { PosterButton } from '../poster/PosterButton';

export interface PosterHeroProps {
  channelName?: string;
  niche?: string;
  onActionClick?: () => void;
}

export const PosterHero: React.FC<PosterHeroProps> = ({
  channelName = 'CREATOR STUDIO',
  niche = 'TECH & STORIES',
  onActionClick,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--ink-navy)',
        border: '4px solid var(--saffron-gold)',
        borderRadius: '10px',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--poster-shadow-gold)',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        backgroundImage:
          'radial-gradient(circle at 80% 30%, rgba(213, 42, 128, 0.25) 0%, transparent 60%), radial-gradient(circle at 10% 70%, rgba(7, 141, 173, 0.2) 0%, transparent 50%)',
      }}
    >
      {/* Decorative Outer Border Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 6,
          border: '1px dashed rgba(244, 169, 40, 0.4)',
          borderRadius: '6px',
          pointerEvents: 'none',
        }}
      />

      {/* Left Column: Festival Lithograph Typography */}
      <div style={{ flex: '1 1 480px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--vermilion)', fontSize: '1.2rem' }}>★</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--saffron-gold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {channelName} // {niche}
          </span>
          <span style={{ color: 'var(--vermilion)', fontSize: '1.2rem' }}>★</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.05,
            color: 'var(--text-on-dark)',
            margin: '0 0 1rem 0',
            textShadow: '3px 3px 0px #D93B32',
          }}
        >
          YOUR NEXT VIDEO <br />
          <span style={{ color: 'var(--saffron-gold)' }}>STARTS HERE.</span>
        </h1>

        <p
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--antique-paper)',
            maxWidth: '560px',
          }}
        >
          Plan your ideas, prepare daily long-form scripts and Shorts packages, and command your YouTube publishing workflow with zero paid API overhead.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <PosterButton variant="saffron" size="lg" onClick={onActionClick}>
            <span>CREATE CONTENT PACKAGE</span>
            <span>➔</span>
          </PosterButton>
          <PosterButton variant="turquoise" size="lg" onClick={onActionClick}>
            <span>OPEN PLANNER</span>
          </PosterButton>
        </div>
      </div>

      {/* Right Column: Ornate Play Medallion & Crest */}
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '1rem',
          margin: '0 auto',
        }}
      >
        <OrnatePlayMedallion size={130} />
        <div
          style={{
            marginTop: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            color: 'var(--saffron-gold)',
            letterSpacing: '0.08em',
            textAlign: 'center',
            textShadow: '1px 1px 0px #000',
          }}
        >
          THE CREATOR EDITION
        </div>
      </div>
    </div>
  );
};
