import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * 
 * Returns true if user prefers reduced motion (accessibility setting).
 * Animations should be disabled or minimized when this returns true.
 * 
 * Usage:
 * const prefersReducedMotion = useReducedMotion();
 * 
 * // With framer-motion:
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: 1.1 }}
 *   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 * />
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is available (SSR safety)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers (Safari < 14)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper to get motion-safe animation props
 * 
 * Returns animation props that respect reduced motion preference.
 * When reduced motion is preferred, returns instant transitions.
 */
export function getMotionProps(prefersReducedMotion: boolean) {
  return {
    // Disable animations when reduced motion is preferred
    transition: prefersReducedMotion 
      ? { duration: 0 } 
      : undefined,
    // Use layout animations only when motion is allowed
    layout: !prefersReducedMotion,
  };
}

/**
 * Default transition that respects reduced motion
 */
export const safeTransition = (prefersReducedMotion: boolean, duration = 0.3) => 
  prefersReducedMotion ? { duration: 0 } : { duration };
