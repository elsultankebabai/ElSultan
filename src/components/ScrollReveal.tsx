import React, { useEffect, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

export const EASE_APPLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Ultra-thin GPU-accelerated chapter reading progress bar pinned cleanly to the bottom hairline of the Header.
 */
export const ScrollProgressRail: React.FC<{ overDark?: boolean }> = ({ overDark = false }) => {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none transition-colors duration-200 ${
        overDark ? 'bg-[#C98B54]' : 'bg-[#672938]'
      }`}
    />
  );
};

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  xOffset?: number;
  scaleFrom?: number;
}

/**
 * Compositor-only architectural scroll entrance (opacity + GPU transform only, viewport once, zero latency lock).
 */
export const EditorialReveal: React.FC<EditorialRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 24,
  xOffset = 0,
  scaleFrom = 0.985,
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset, scale: scaleFrom }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: EASE_APPLE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface EditorialRuleProps {
  className?: string;
  tone?: 'dark' | 'light' | 'accent';
  delay?: number;
}

/**
 * Hairline separator that draws horizontally from left to right when scrolled into view.
 */
export const EditorialRule: React.FC<EditorialRuleProps> = ({
  className = '',
  tone = 'dark',
  delay = 0,
}) => {
  const prefersReduced = useReducedMotion();
  const colorClass =
    tone === 'accent'
      ? 'bg-[#C98B54]/45'
      : tone === 'light'
      ? 'bg-[#F3EADA]/18'
      : 'bg-[#191B1A]/16';

  if (prefersReduced) {
    return <div aria-hidden="true" className={`h-px w-full ${colorClass} ${className}`} />;
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0, opacity: 0.4 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay, ease: EASE_APPLE }}
      style={{ transformOrigin: '0% 50%' }}
      className={`h-px w-full ${colorClass} ${className}`}
    />
  );
};

interface ScrollFloatProps {
  children: React.ReactNode;
  className?: string;
  yRange?: [number, number];
  xRange?: [number, number];
  rotateRange?: [number, number];
  scaleRange?: [number, number];
}

/**
 * Continuous scroll-scrubbed floating container.
 * Uses only spring-smoothed GPU transforms (translate3d, rotate, scale) tied to viewport scroll progress.
 */
export const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  className = '',
  yRange = [42, -42],
  xRange = [0, 0],
  rotateRange = [-4, 4],
  scaleRange = [0.97, 1.03],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.45,
  });

  const y = useTransform(smoothProgress, [0, 1], yRange);
  const x = useTransform(smoothProgress, [0, 1], xRange);
  const rotate = useTransform(smoothProgress, [0, 1], rotateRange);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [scaleRange[0], scaleRange[1], scaleRange[0]]);

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, x, rotate, scale }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxFrameProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectClass?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Rounded editorial image frame with lazy-loaded GSAP ScrollTrigger parallax depth scrub.
 */
export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  src,
  srcSet,
  sizes,
  width = 1440,
  height = 900,
  alt,
  className = '',
  imgClassName = 'object-center',
  aspectClass = 'aspect-[16/10]',
  loading = 'lazy',
  fetchPriority = 'auto',
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !frameRef.current || !imgRef.current) return;

    let cancelled = false;
    let revertFn: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled || !frameRef.current || !imgRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.fromTo(
            imgRef.current,
            { scale: 1.08, yPercent: -3.5 },
            {
              scale: 1,
              yPercent: 3.5,
              ease: 'none',
              scrollTrigger: {
                trigger: frameRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }, frameRef);
        revertFn = () => ctx.revert();
      })
      .catch(() => {
        // Fallback smoothly to static image frame if dynamic chunk load fails
      });

    return () => {
      cancelled = true;
      revertFn?.();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={`relative ${aspectClass} overflow-hidden bg-[#191B1A] rounded-3xl shadow-md ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={loading}
        decoding={loading === 'eager' ? 'sync' : 'async'}
        fetchPriority={fetchPriority}
        className={`w-full h-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  );
};
