import { useEffect, useRef } from 'react';

interface AmbientGlowProps {
  /** Colors to cycle through */
  colors?: string[];
  /** Size of each glow blob */
  size?: number;
  /** Opacity */
  opacity?: number;
  /** Z-index */
  zIndex?: number;
  /** Only show on mobile (hide on desktop) */
  mobileOnly?: boolean;
}

const DEFAULT_COLORS = [
  'rgba(212, 163, 115, 0.08)',
  'rgba(180, 130, 90, 0.06)',
  'rgba(220, 180, 140, 0.07)',
  'rgba(200, 150, 100, 0.05)',
];

export default function AmbientGlow({
  colors = DEFAULT_COLORS,
  size = 400,
  duration = 20,
  opacity = 1,
  zIndex = 0,
  mobileOnly = false,
}: AmbientGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    if (mobileOnly && !isMobile) return;

    // Create blob elements
    container.innerHTML = '';
    blobsRef.current = [];

    const numBlobs = Math.min(colors.length, 4);
    for (let i = 0; i < numBlobs; i++) {
      const blob = document.createElement('div');
      blob.className = 'absolute rounded-full pointer-events-none will-change-transform';
      blob.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${colors[i]} 0%, transparent 70%);
        opacity: 0;
        border-radius: 50%;
      `;
      container.appendChild(blob);
      blobsRef.current.push(blob);
    }

    // Phase offsets for each blob
    const phases = blobsRef.current.map((_, i) => (i / blobsRef.current.length) * Math.PI * 2);

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000;

      blobsRef.current.forEach((blob, i) => {
        const phase = phases[i];
        const t = timeRef.current * 0.3 + phase;

        // Slow organic movement using sine waves
        const x = 20 + Math.sin(t * 0.7) * 30 + Math.sin(t * 0.3) * 15;
        const y = 20 + Math.cos(t * 0.5 + phase) * 25 + Math.sin(t * 0.4) * 10;
        const scale = 0.8 + Math.sin(t * 0.2 + phase) * 0.3;
        const blobOpacity = 0.4 + Math.sin(t * 0.15 + phase) * 0.3;

        blob.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
        blob.style.opacity = String(blobOpacity);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.innerHTML = '';
    };
  }, [colors, size, mobileOnly, duration]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}
