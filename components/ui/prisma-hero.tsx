'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = '',
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <div ref={ref} className={cn('inline-flex flex-wrap', className)} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            // Com movimento reduzido o título aparece de uma vez (mesmo estado inicial do SSR)
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = '', style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={cn('inline-flex flex-wrap justify-center', className)} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          className={cn('inline-block', w.className)}
          style={{ marginRight: '0.25em' }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
export interface PrismaHeroNavItem {
  label: string;
  href: string;
}

interface PrismaHeroProps {
  title: string;
  description: string;
  eyebrow?: string;
  ctaLabel: string;
  ctaHref: string;
  navItems: PrismaHeroNavItem[];
  videoSrc: string;
  posterSrc?: string;
}

const PrismaHero = ({
  title,
  description,
  eyebrow,
  ctaLabel,
  ctaHref,
  navItems,
  videoSrc,
  posterSrc,
}: PrismaHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Quem pede menos movimento fica com o primeiro quadro parado em vez do loop.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause();
  }, []);

  return (
    <section className="h-[100svh] w-full bg-night p-2 md:p-3">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterSrc}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
        />

        {/* Noise + scanlines: textura de filme/monitor antigo */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="scanlines pointer-events-none absolute inset-0" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night/80" />

        {/* Logo */}
        <Link href="/" className="absolute left-4 top-3 z-20 hidden md:block md:left-8 md:top-5">
          <Image
            src="/logo-blueview.png"
            alt="Blueview Imóveis"
            width={83}
            height={56}
            className="h-14 w-auto brightness-0 invert"
            priority
          />
        </Link>

        {/* Navbar */}
        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-night px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 md:py-3 lg:gap-14">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-roll text-[10px] text-white/75 transition-colors hover:text-white sm:text-xs md:text-sm"
              >
                <span className="nav-roll-text" data-text={item.label}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-display font-medium leading-[0.85] tracking-[-0.07em] text-white text-[22vw] sm:text-[21vw] lg:text-[14vw]">
                <WordsPullUp text={title} />
              </h1>
            </div>

            <div className="relative z-10 col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
              {eyebrow && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-azure sm:text-xs"
                >
                  {eyebrow}
                </motion.p>
              )}

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                className="text-xs text-white/75 sm:text-sm md:text-base"
                style={{ lineHeight: 1.25 }}
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="self-start"
              >
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent py-1 pl-5 pr-1 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-accent-dark sm:text-base"
                >
                  {ctaLabel}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
