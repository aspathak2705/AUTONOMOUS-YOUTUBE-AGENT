import React from 'react';
import { DualAsset } from '../../assets';

interface PosterAssetImageProps {
  asset: DualAsset;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export const PosterAssetImage: React.FC<PosterAssetImageProps> = ({
  asset,
  className = '',
  width,
  height,
  loading = 'lazy',
  style,
}) => {
  return (
    <picture className={`poster-asset-picture ${className}`}>
      <source srcSet={asset.webp} type="image/webp" />
      <img
        src={asset.png}
        alt={asset.alt}
        width={width}
        height={height}
        loading={loading}
        style={{ maxWidth: '100%', height: 'auto', display: 'block', ...style }}
        draggable={false}
      />
    </picture>
  );
};
