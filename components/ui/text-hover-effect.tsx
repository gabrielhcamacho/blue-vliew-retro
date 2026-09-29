'use client';

import { useId, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextHoverEffectProps {
  text: string;
  className?: string;
  /** Cores do degradê revelado pelo cursor, do centro (sob o mouse) para fora. */
  colors?: string[];
  /** Duração (s) do traço se desenhando quando o texto entra na tela. */
  duration?: number;
}

/**
 * Texto gigante só em contorno: o traço se desenha sozinho ao entrar na tela e, sob o
 * cursor, um holofote radial revela o contorno em degradê (salmão no centro → índigo → azure).
 */
export function TextHoverEffect({
  text,
  className,
  colors = ['#ff751f', '#ff751f', '#1f4fd1', '#76d3f6'],
  duration = 4,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, amount: 0.4 });
  const [hovered, setHovered] = useState(false);
  const [mask, setMask] = useState({ cx: '50%', cy: '50%' });
  const uid = useId().replace(/:/g, '');
  const gradientId = `thg-${uid}`;
  const revealId = `thr-${uid}`;
  const maskId = `thm-${uid}`;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMask({
      cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
  };

  // Atributos comuns às três camadas de texto (base, desenho e degradê).
  const textProps = {
    x: '50%',
    y: '54%',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    textLength: '96%',
    lengthAdjust: 'spacingAndGlyphs',
    strokeWidth: 0.35,
    className: 'fill-transparent font-display font-bold tracking-tight',
    style: { fontSize: 88 },
  } as const;

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 500 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full select-none', className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={onMove}
    >
      <defs>
        {/* O degradê acompanha o cursor: salmão sob o mouse, índigo e azure ao redor */}
        <motion.radialGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          r="18%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={mask}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {colors.map((c, i) => (
            <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </motion.radialGradient>
        <motion.radialGradient
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r="26%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={mask}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${revealId})`} />
        </mask>
      </defs>

      {/* Contorno de fundo, mais visível durante o hover */}
      <text
        {...textProps}
        className={cn(textProps.className, 'stroke-azure transition-opacity duration-300')}
        style={{ ...textProps.style, opacity: hovered ? 0.25 : 0 }}
      >
        {text}
      </text>

      {/* Contorno que se desenha ao entrar na tela */}
      <motion.text
        {...textProps}
        className={cn(textProps.className, 'stroke-azure/40')}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={inView ? { strokeDashoffset: 0, strokeDasharray: 1000 } : undefined}
        transition={{ duration, ease: 'easeInOut' }}
      >
        {text}
      </motion.text>

      {/* Contorno em degradê revelado pelo holofote do cursor */}
      <text
        {...textProps}
        stroke={`url(#${gradientId})`}
        strokeWidth={1.1}
        mask={`url(#${maskId})`}
        className={cn(textProps.className, 'transition-opacity duration-300')}
        style={{ ...textProps.style, opacity: hovered ? 1 : 0 }}
      >
        {text}
      </text>
    </svg>
  );
}
