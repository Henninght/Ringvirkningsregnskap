"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseAnimatedValueOptions {
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Easing function - default is ease-out cubic */
  easing?: (t: number) => number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Whether to animate on initial mount */
  animateOnMount?: boolean;
}

// Easing functions
export const easings = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
};

/**
 * Hook for animating numeric values with smooth transitions.
 * Useful for counters, progress bars, and any numeric display that should
 * smoothly transition when its value changes.
 *
 * @param targetValue - The value to animate towards
 * @param options - Animation configuration options
 * @returns The current animated value
 *
 * @example
 * const animatedTotal = useAnimatedValue(calculation.total, { duration: 700 });
 * return <span>{formatCurrency(animatedTotal)}</span>;
 */
export function useAnimatedValue(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): number {
  const {
    duration = 700,
    easing = easings.easeOutCubic,
    delay = 0,
    animateOnMount = true,
  } = options;

  const [displayValue, setDisplayValue] = useState(animateOnMount ? 0 : targetValue);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(animateOnMount ? 0 : targetValue);
  const startTimeRef = useRef<number | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip animation on first mount if animateOnMount is false
    if (isFirstMount.current && !animateOnMount) {
      isFirstMount.current = false;
      setDisplayValue(targetValue);
      startValueRef.current = targetValue;
      return;
    }
    isFirstMount.current = false;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = startValueRef.current;
    const valueDiff = targetValue - startValue;

    // Skip animation for very small changes (less than 0.1% difference)
    if (Math.abs(valueDiff) < Math.abs(targetValue * 0.001)) {
      setDisplayValue(targetValue);
      startValueRef.current = targetValue;
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime + delay;
      }

      const elapsed = currentTime - startTimeRef.current;

      if (elapsed < 0) {
        // Still in delay period
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = startValue + valueDiff * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        startValueRef.current = targetValue;
        startTimeRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, easing, delay, animateOnMount]);

  return displayValue;
}

/**
 * Hook for animating percentage values (0-100) with clamping.
 * Ensures values stay within valid percentage bounds.
 */
export function useAnimatedPercentage(
  targetPercentage: number,
  options: UseAnimatedValueOptions = {}
): number {
  const clampedTarget = Math.max(0, Math.min(100, targetPercentage));
  return useAnimatedValue(clampedTarget, options);
}

/**
 * Hook that returns both the animated value and a reset function.
 * Useful when you need to restart an animation from zero.
 */
export function useAnimatedValueWithReset(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): [number, () => void] {
  const [resetKey, setResetKey] = useState(0);
  const animatedValue = useAnimatedValue(
    targetValue,
    { ...options, animateOnMount: true }
  );

  const reset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  return [animatedValue, reset];
}
