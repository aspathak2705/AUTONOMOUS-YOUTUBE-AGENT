import React from 'react';
import { illustrations, ornaments } from '../../assets';
import { PosterAssetImage } from '../poster/PosterAssetImage';
import { PosterButton } from '../poster/PosterButton';

export interface PosterHeroProps {
  channelName?: string;
  niche?: string;
  onActionClick?: () => void;
  onPlannerClick?: () => void;
}

export const PosterHero: React.FC<PosterHeroProps> = ({
  channelName = 'CREATOR STUDIO',
  niche = 'TECH & STORIES',
  onActionClick,
  onPlannerClick,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--ink-navy)',
        border: '4px solid var(--saffron-gold)',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--poster-shadow-gold)',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2.5rem',
        backgroundImage:
          'radial-gradient(circle at 85% 30%, rgba(213, 42, 128, 0.22) 0%, transparent 60%), radial-gradient(circle at 15% 75%, rgba(7, 141, 173, 0.2) 0%, transparent 50%)',
      }}
    >
      {/* Decorative Ornate Corners from extracted assets */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          width: 72,
          height: 56,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <PosterAssetImage asset={ornaments.cornerTl} width={72} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 72,
          height: 56,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <PosterAssetImage asset={ornaments.cornerTr} width={72} />
      </div>

      {/* Decorative Inner Border Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          border: '1px dashed rgba(244, 169, 40, 0.45)',
          borderRadius: '8px',
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
          <PosterButton variant="turquoise" size="lg" onClick={onPlannerClick || onActionClick}>
            <span>OPEN PLANNER</span>
          </PosterButton>
        </div>
      </div>

      {/* Right Column: Workstation Illustration Frame */}
      <div
        style={{
          flex: '0 1 420px',
          position: 'relative',
          zIndex: 2,
          margin: '0 auto',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            borderRadius: '10px',
            border: '3px solid var(--saffron-gold)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            backgroundColor: '#0c071a',
            position: 'relative',
          }}
          className="hero-workstation-container"
        >
          <PosterAssetImage
            asset={illustrations.workstation}
            width={420}
            height={280}
            loading="eager"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Subtitle tag */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(17, 26, 50, 0.92)',
              borderTop: '2px solid var(--saffron-gold)',
              padding: '0.4rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--saffron-gold)',
              letterSpacing: '0.08em',
            }}
          >
            <span>AUTONOMOUS PRODUCTION SUITE</span>
            <span>★ ZERO-PAID-API</span>
          </div>
        </div>
      </div>
    </div>
  );
};
