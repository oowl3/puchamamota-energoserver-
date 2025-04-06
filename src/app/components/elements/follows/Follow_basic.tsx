'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface FollowCursorProps {
  color?: string;
  size?: number;
  borderWidth?: number;
}

const FollowCursorGSAP = ({ 
  color = '#A6D900', 
  size = 50,
  borderWidth = 2
}: FollowCursorProps) => {
  const ballRef = useRef<HTMLDivElement>(null);
  
  // Corrección definitiva de tipos con inicialización adecuada
  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  useLayoutEffect(() => {
    if (!ballRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      ballRef.current.style.display = 'none';
      return;
    }

    gsap.set(ballRef.current, {
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    xTo.current = gsap.quickTo(ballRef.current, "x", {
      duration: 0.6,
      ease: "power3"
    });

    yTo.current = gsap.quickTo(ballRef.current, "y", {
      duration: 0.6,
      ease: "power3"
    });

    const moveCursor = (e: MouseEvent) => {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      xTo.current = null;
      yTo.current = null;
    };
  }, []);

  return (
    <div
      ref={ballRef}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${color}`,
        borderRadius: '50%',
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default FollowCursorGSAP;