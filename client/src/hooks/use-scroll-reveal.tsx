import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

interface StaggerRevealProps extends ScrollRevealProps {
  staggerDelay?: number;
}

export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

export function ScrollReveal({ children, className = '', threshold = 0.1, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(20px)';
      case 'down':
        return 'translateY(-20px)';
      case 'left':
        return 'translateX(20px)';
      case 'right':
        return 'translateX(-20px)';
      default:
        return 'translateY(20px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `all 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerReveal({ children, className = '', threshold = 0.1, delay = 0, direction = 'up', staggerDelay = 100 }: StaggerRevealProps) {
  const { ref, isVisible } = useScrollReveal();

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(20px)';
      case 'down':
        return 'translateY(-20px)';
      case 'left':
        return 'translateX(20px)';
      case 'right':
        return 'translateX(-20px)';
      default:
        return 'translateY(20px)';
    }
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : getTransform(),
            transition: `all 0.6s ease-out ${delay + index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}