'use client';

import { useEffect, useRef, useState } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: Animation;
  threshold?: number;
}

const hidden: Record<Animation, string> = {
  'fade-up': 'opacity-0 translate-y-10',
  'fade-in': 'opacity-0',
  'slide-left': 'opacity-0 -translate-x-10',
  'slide-right': 'opacity-0 translate-x-10',
};

const visible: Record<Animation, string> = {
  'fade-up': 'opacity-100 translate-y-0',
  'fade-in': 'opacity-100',
  'slide-left': 'opacity-100 translate-x-0',
  'slide-right': 'opacity-100 translate-x-0',
};

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
  threshold = 0.1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;
    let observer: IntersectionObserver | undefined;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      setTimeout(() => setShow(true), delay);
    };

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal();
    };

    // Catches window.scrollTo() called by Next.js App Router for scroll restoration.
    // This fires regardless of timing — no setTimeout guesswork needed.
    const handleScroll = () => { if (!revealed) check(); };

    // (a) Immediate check — element already in/above viewport on mount.
    check();

    if (!revealed) {
      // (b) Scroll listener — catches Next.js scroll restoration fired after useEffect.
      window.addEventListener('scroll', handleScroll, { passive: true });

      // (c) IntersectionObserver — primary trigger for natural below-fold scrolling.
      observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) reveal(); },
        { threshold, rootMargin: '0px 0px -60px 0px' }
      );
      observer.observe(el);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${show ? visible[animation] : hidden[animation]} ${className}`}
    >
      {children}
    </div>
  );
}
