'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { REGIONS } from '@/app/lib/regions';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Linha costeira esquemática de Praia Brava a Porto Belo (norte para cima, mar a leste).
 * Não é cartografia: é o desenho simplificado das enseadas, com a península de Porto Belo.
 */
const COAST =
  'M160 0 C 200 22, 222 44, 214 70 S 186 122, 196 150 S 222 236, 176 292 S 214 360, 250 392 S 262 450, 220 480';

// Curvas de nível: a mesma costa deslocada para dentro do continente
const CONTOURS = [-22, -46, -74, -106];

/** Reflexos no mar: [y, x inicial, comprimento]. */
const SEA = [
  [40, 270, 70], [96, 262, 110], [132, 300, 60], [188, 258, 90], [226, 300, 80],
  [270, 250, 120], [318, 262, 50], [360, 322, 70], [430, 300, 90], [456, 260, 60],
];

export function CoastMap({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const t = (d: object) => (reduceMotion ? { duration: 0 } : d);

  return (
    <svg
      viewBox="0 0 400 480"
      role="img"
      aria-label="Mapa esquemático do litoral com Praia Brava, Balneário Camboriú, Itapema e Porto Belo"
      className={cn('overflow-visible', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="coast-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#76d3f6" />
          <stop offset="1" stopColor="#ff751f" />
        </linearGradient>
        {/* Continente: some para o oeste, mais denso junto à costa */}
        <linearGradient id="coast-land" gradientUnits="userSpaceOnUse" x1="-60" y1="0" x2="250" y2="0">
          <stop offset="0" stopColor="#0f0392" stopOpacity="0" />
          <stop offset="1" stopColor="#0f0392" stopOpacity="0.55" />
        </linearGradient>
        {/* Esfuma o desenho no norte e no sul, sem bordas retas */}
        <linearGradient id="coast-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.9" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="coast-mask" maskUnits="userSpaceOnUse" x="-80" y="0" width="560" height="480">
          <rect x="-80" y="0" width="560" height="480" fill="url(#coast-fade)" />
        </mask>
      </defs>

      <g mask="url(#coast-mask)">

      {/* Continente */}
      <motion.path
        d={`${COAST} L -60 480 L -60 0 Z`}
        fill="url(#coast-land)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t({ duration: 1.4, delay: 0.4 })}
      />

      {CONTOURS.map((dx, i) => (
        <motion.path
          key={dx}
          d={COAST}
          transform={`translate(${dx} 0)`}
          stroke="#76d3f6"
          strokeWidth={0.8}
          strokeDasharray={i % 2 ? '2 5' : undefined}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 - i * 0.045 }}
          transition={t({ duration: 1.2, delay: 1 + i * 0.15 })}
        />
      ))}

      {SEA.map(([y, x, w], i) => (
        <motion.line
          key={i}
          x1={x}
          x2={x + w}
          y1={y}
          y2={y}
          stroke="#76d3f6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.18 + (i % 3) * 0.08, pathLength: 1 }}
          transition={t({ duration: 1.2, delay: 1.2 + i * 0.06, ease: EASE })}
        />
      ))}

      {/* A costa */}
      <motion.path
        d={COAST}
        stroke="url(#coast-stroke)"
        strokeWidth={1.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: 'drop-shadow(0 0 6px rgba(118,211,246,0.5))' }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={t({ duration: 2.4, delay: 0.2, ease: EASE })}
      />

      </g>

      {/* Percurso entre as regiões: a leitura de mercado que liga um ponto ao outro */}
      <motion.path
        d={REGIONS.map((r, i) => `${i ? 'L' : 'M'}${r.map.x + 34} ${r.map.y}`).join(' ')}
        stroke="#ff751f"
        strokeWidth={0.8}
        strokeDasharray="1 6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={t({ duration: 1, delay: 2.4 })}
      />

      {REGIONS.map((r, i) => (
        <motion.g
          key={r.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ duration: 0.7, delay: 1.6 + i * 0.18, ease: EASE })}
        >
          <line x1={r.map.x} x2={r.map.x + 34} y1={r.map.y} y2={r.map.y} stroke="rgba(255,255,255,0.35)" vectorEffect="non-scaling-stroke" />
          <circle cx={r.map.x} cy={r.map.y} r={9} stroke="#ff751f" strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
          <circle cx={r.map.x} cy={r.map.y} r={3.5} fill="#ff751f" style={{ filter: 'drop-shadow(0 0 5px #ff751f)' }} />
          <text x={r.map.x + 42} y={r.map.y - 2} fill="#fff" fontSize={15} fontFamily="var(--font-space-grotesk)" letterSpacing="-0.02em">
            {r.name}
          </text>
          <text x={r.map.x + 42} y={r.map.y + 14} fill="rgba(255,255,255,0.45)" fontSize={8.5} fontFamily="var(--font-geist-mono)" letterSpacing="0.12em">
            {r.coords}
          </text>
        </motion.g>
      ))}

      {/* Rosa dos ventos mínima */}
      <g opacity={0.5} fontFamily="var(--font-geist-mono)" fontSize={9} fill="rgba(255,255,255,0.6)">
        <line x1={372} x2={372} y1={8} y2={34} stroke="rgba(255,255,255,0.4)" vectorEffect="non-scaling-stroke" />
        <text x={368} y={48}>N</text>
      </g>
    </svg>
  );
}
