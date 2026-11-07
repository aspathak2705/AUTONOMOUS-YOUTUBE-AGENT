import React from 'react';

/**
 * Ornate Arch Medallion with YouTube Play Symbol
 * Inspired by Indian vintage lithograph posters and architectural toranas
 */
export const OrnatePlayMedallion: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Radiant Lotus Ray Border */}
        <circle cx="50" cy="50" r="46" stroke="#F4A928" strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="42" fill="#111A32" stroke="#24152C" strokeWidth="2" />
        
        {/* Scalloped Mandala Floral Petals */}
        <path
          d="M50 10 C53 20 60 20 68 18 C65 26 70 30 79 33 C72 39 74 46 80 50 C74 54 72 61 79 67 C70 70 65 74 68 82 C60 80 53 80 50 90 C47 80 40 80 32 82 C35 74 30 70 21 67 C28 61 26 54 20 50 C26 46 28 39 21 33 C30 30 35 26 32 18 C40 20 47 20 50 10 Z"
          fill="#D93B32"
          stroke="#F4A928"
          strokeWidth="1.5"
        />

        {/* Inner Gold Medallion Ring */}
        <circle cx="50" cy="50" r="28" fill="#F4DEB6" stroke="#24152C" strokeWidth="2" />
        <circle cx="50" cy="50" r="24" fill="#078DAD" stroke="#F4A928" strokeWidth="1.5" />

        {/* Central YouTube Play Glyph */}
        <polygon points="44,38 62,50 44,62" fill="#FDF6E7" stroke="#24152C" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

/**
 * Ornate Corner Accent (Vintage Print Filigree)
 */
export const OrnateCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
}> = ({ position, size = 32, color = '#F4A928' }) => {
  const transformMap = {
    'top-left': 'none',
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1, -1)',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: transformMap[position],
        position: 'absolute',
        top: position.includes('top') ? 2 : 'auto',
        bottom: position.includes('bottom') ? 2 : 'auto',
        left: position.includes('left') ? 2 : 'auto',
        right: position.includes('right') ? 2 : 'auto',
        pointerEvents: 'none',
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      <path
        d="M2 2 H14 C14 8 8 14 2 14 V2 Z"
        fill={color}
        stroke="#24152C"
        strokeWidth="1"
      />
      <circle cx="6" cy="6" r="2" fill="#D93B32" />
      <path d="M2 2 L20 2 C20 18 18 20 2 20 Z" stroke={color} strokeWidth="1" strokeDasharray="1 2" fill="none" />
      <path d="M2 24 L24 2" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

/**
 * Ornate Divider with Central Motif
 */
export const OrnateDivider: React.FC<{ color?: string; style?: React.CSSProperties }> = ({
  color = '#F4A928',
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        margin: '1.5rem 0',
        width: '100%',
        ...style,
      }}
      aria-hidden="true"
    >
      <div style={{ flex: 1, height: '2px', background: `linear-gradient(90deg, transparent, ${color})` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: color, display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, transform: 'rotate(45deg)', background: '#D93B32', border: `1px solid ${color}`, display: 'inline-block' }} />
        <span style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: color, display: 'inline-block' }} />
      </div>
      <div style={{ flex: 1, height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
};
