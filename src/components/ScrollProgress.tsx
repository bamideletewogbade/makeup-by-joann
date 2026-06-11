import { useEffect, useRef } from 'react';

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export default function ScrollProgress({
  color = '#D4A373',
  height = 2.5,
}: ScrollProgressProps) {  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 pointer-events-none z-50"
      style={{ height }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="absolute inset-0 origin-left will-change-transform"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}60, 0 0 2px ${color}30`,
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
