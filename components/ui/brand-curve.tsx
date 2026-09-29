'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BRAND_ARC, BRAND_WAVE } from './brand-paths';

const EASE = [0.22, 1, 0.36, 1] as const;

interface BrandCurveProps {
  className?: string;
  /** Qual das linhas desenhar. */
  show?: 'both' | 'arc' | 'wave';
  /** Espessura do traço em px de tela (não escala com o SVG). */
  strokeWidth?: number;
  /** Atraso em segundos antes de começar a desenhar. */
  delay?: number;
  /** Desenha ao montar (heros) em vez de esperar a seção entrar na tela. */
  onMount?: boolean;
  arcColor?: string;
  waveColor?: string;
  /** Brilho suave em volta do traço. */
  glow?: boolean;
}

/**
 * As linhas da logomarca como grafismo ampliado nas páginas internas. O traço é desenhado
 * uma vez ao entrar na tela e para.
 */
export function BrandCurve({
  className,
  show = 'both',
  strokeWidth = 1.5,
  delay = 0,
  onMount = false,
  arcColor = '#ff751f',
  waveColor = '#76d3f6',
  glow = true,
}: BrandCurveProps) {
  const reduceMotion = useReducedMotion();
  const paths = [
    show !== 'wave' && { d: BRAND_ARC, color: arcColor, at: 0 },
    show !== 'arc' && { d: BRAND_WAVE, color: waveColor, at: show === 'both' ? 0.35 : 0 },
  ].filter(Boolean) as { d: string; color: string; at: number }[];

  const target = { pathLength: 1, opacity: 1 };

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 530"
      preserveAspectRatio="none"
      fill="none"
      className={cn('pointer-events-none', className)}
    >
      {paths.map((p) => (
        <motion.path
          key={p.d}
          d={p.d}
          stroke={p.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={glow ? { filter: `drop-shadow(0 0 6px ${p.color}99)` } : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          {...(onMount ? { animate: target } : { whileInView: target, viewport: { once: true, amount: 0.3 } })}
          // Com movimento reduzido a linha aparece inteira (mesmo estado inicial do SSR)
          transition={
            reduceMotion
              ? { duration: 0 }
              : { pathLength: { duration: 2.2, delay: delay + p.at, ease: EASE }, opacity: { duration: 0.4, delay: delay + p.at } }
          }
        />
      ))}
    </svg>
  );
}
