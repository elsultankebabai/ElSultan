import React from 'react';

export type BrandTone = 'burgundy' | 'bone' | 'charcoal';

interface WordmarkProps {
  tone?: BrandTone;
  className?: string;
  alt?: string;
}

const WORDMARK_SRC: Record<BrandTone, string> = {
  burgundy: '/assets/brand/wordmark-burgundy.svg',
  bone: '/assets/brand/wordmark-bone.svg',
  charcoal: '/assets/brand/wordmark-charcoal.svg',
};

/**
 * Exact outlined SVG wordmark asset extracted from the EL SULTAN Brand Standards PDF.
 * Never rendered as ordinary HTML text. Aspect ratio preserved (386 : 166).
 */
export const ElSultanWordmark: React.FC<WordmarkProps> = ({
  tone = 'burgundy',
  className = 'h-9 w-auto',
  alt = 'EL SULTAN',
}) => {
  return (
    <img
      src={WORDMARK_SRC[tone]}
      alt={alt}
      width={386}
      height={166}
      className={`block select-none shrink-0 object-contain ${className}`}
    />
  );
};

export type ChairTone = 'burgundy' | 'bone' | 'charcoal' | 'ochre';

interface ChairAssetProps {
  tone?: ChairTone;
  className?: string;
}

const CHAIR_SRC: Record<ChairTone, string> = {
  burgundy: '/assets/brand/chair-burgundy.svg',
  bone: '/assets/brand/chair-bone.svg',
  charcoal: '/assets/brand/chair-charcoal.svg',
  ochre: '/assets/brand/chair-ochre.svg',
};

/**
 * Exact four-spindle curved chair silhouette SVG asset (240 : 126).
 * Preserves approved proportions and upright orientation.
 */
export const ChairMark: React.FC<ChairAssetProps> = ({
  tone = 'burgundy',
  className = 'w-28 h-auto',
}) => {
  return (
    <img
      src={CHAIR_SRC[tone]}
      alt=""
      aria-hidden="true"
      width={240}
      height={126}
      className={`block select-none shrink-0 object-contain ${className}`}
    />
  );
};
