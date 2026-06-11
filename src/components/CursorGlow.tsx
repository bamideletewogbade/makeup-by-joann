import { useEffect, useRef } from 'react';

interface CursorGlowProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  color?: string;
  size?: number;
  opacity?: number;
  zIndex?: number;
  /** Show secondary sparkle particles following the cursor */
  particles?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  delay: number;
}

export default function CursorGlow({
  containerRef,
  color = 'rgba(212, 163, 115, 0.15)',
  size = 500,
  opacity = 0.6,
  zIndex = 0,
  particles = false,
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const posRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRefs = useRef<Particle[]>([]);
  const particleEls = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = glowRef.current;
    const pEl = particlesRef.current;
    if (!el) return;

    const target = containerRef?.current;
    const useContainer = !!target;

    // Initialize particles
    if (particles && pEl) {
      const count = 12;
      particlesRefs.current = Array.from({ length: count }, (_, i) => ({
        x: 0.5, y: 0.5, size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4, life: 0, delay: i * 0.04,
      }));
      pEl.innerHTML = '';
      particleEls.current = particlesRefs.current.map((p) => {
        const span = document.createElement('span');
        span.className = 'absolute rounded-full pointer-events-none';
        span.style.cssText = `width:${p.size}px;height:${p.size}px;background:${color.replace(/[\d.]+\)$/, '0.6)')};border-radius:50%;will-change:transform,opacity;`;
        pEl.appendChild(span);
        return span;
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      if (useContainer && target) {
        const rect = target.getBoundingClientRect();
        mouseRef.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        };
      } else {
        mouseRef.current = {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        };
      }
    };

    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.06;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.06;

      // Main glow
      el.style.left = `${posRef.current.x * 100}%`;
      el.style.top = `${posRef.current.y * 100}%`;
      el.style.transform = 'translate(-50%, -50%)';

      // Particles (smooth trailing effect)
      if (particles && particleEls.current.length > 0) {
        particleEls.current.forEach((sp, i) => {
          const p = particlesRefs.current[i];
          if (!p) return;
          const delay = p.delay;
          // Each particle trails with graduated lag — all derived from smooth lerped position
          const lagFactor = 0.3 + delay * 3;
          const followX = posRef.current.x + (mouseRef.current.x - posRef.current.x) * Math.max(0, 1 - lagFactor);
          const followY = posRef.current.y + (mouseRef.current.y - posRef.current.y) * Math.max(0, 1 - lagFactor);
          sp.style.left = `${followX * 100}%`;
          sp.style.top = `${followY * 100}%`;
          sp.style.opacity = String(Math.max(0.1, 0.5 - delay * 2));
          sp.style.transform = `translate(-50%, -50%) scale(${Math.max(0.2, 1 - delay)})`;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Only add ONE listener — on the target if provided, otherwise on window
    if (useContainer && target) {
      target.addEventListener('mousemove', onMouseMove, { passive: true });
    } else {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (useContainer && target) {
        target.removeEventListener('mousemove', onMouseMove);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, size, color, particles]);

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-0 left-0 will-change-transform"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          zIndex,
        }}
        aria-hidden="true"
      />
      {particles && (
        <div
          ref={particlesRef}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ zIndex: zIndex + 1 }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
