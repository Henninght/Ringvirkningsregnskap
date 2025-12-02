"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * AnimatedCounter - Animerer tall fra 0 til målverdi
 *
 * Bruker Framer Motion springs for smooth, naturlig animasjon.
 * Tallene telles opp når komponenten kommer i viewport.
 */
export function AnimatedCounter({
  value,
  duration = 2,
  formatOptions,
  className,
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Use spring for smooth, natural animation
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  // Transform to rounded value
  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    const formatted = new Intl.NumberFormat("nb-NO", formatOptions).format(rounded);
    return `${prefix}${formatted}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    return display.on("change", (latest) => {
      setDisplayValue(latest);
    });
  }, [display]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

/**
 * AnimatedDecimal - For tall med desimaler (f.eks. "6,7 TWh")
 */
export function AnimatedDecimal({
  value,
  decimals = 1,
  duration = 2,
  className,
  suffix = "",
  prefix = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    const formatted = new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(current);
    return `${prefix}${formatted}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    return display.on("change", (latest) => {
      setDisplayValue(latest);
    });
  }, [display]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
