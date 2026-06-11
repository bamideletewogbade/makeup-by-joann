import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction: up, down, left, right, fade, scale */
  animation?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Distance in px for directional animations */
  distance?: number;
  /** Threshold for IntersectionObserver (0-1) */
  threshold?: number;
  /** Custom className */
  className?: string;
  /** Only animate once */
  once?: boolean;
  /** Stagger index for parent-child coordination */
  staggerIndex?: number;
  /** Stagger delay between items */
  staggerDelay?: number;
}

const getInitialStyles = (animation: string, distance: number) => {
  switch (animation) {
    case 'up': return { opacity: 0, transform: `translateY(${distance}px)` };
    case 'down': return { opacity: 0, transform: `translateY(${-distance}px)` };
    case 'left': return { opacity: 0, transform: `translateX(${distance}px)` };
    case 'right': return { opacity: 0, transform: `translateX(${-distance}px)` };
    case 'scale': return { opacity: 0, transform: 'scale(0.9)' };
    case 'fade': return { opacity: 0 };
    default: return { opacity: 0, transform: `translateY(${distance}px)` };
  }
};

export default function ScrollReveal({
  children,
  animation = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  threshold = 0.1,
  className = '',
  once = true,
  staggerIndex = 0,
  staggerDelay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const totalDelay = delay + staggerIndex * staggerDelay;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay before showing
          setTimeout(() => {
            setIsVisible(true);
            if (once) {
              setHasAnimated(true);
              observer.unobserve(el);
            }
          }, totalDelay * 1000);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, once, delay, staggerIndex, staggerDelay]);

  if (hasAnimated && once) {
    return <div className={className}>{children}</div>;
  }

  const initial = getInitialStyles(animation, distance);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : initial.opacity,
        transform: isVisible ? 'translate(0, 0) scale(1)' : initial.transform,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
