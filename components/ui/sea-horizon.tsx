import { cn } from '@/lib/utils';

/** Reflexos sobre o mar: [distância do horizonte em %, largura em %, deslocamento em %, opacidade]. */
const REFLECTIONS: [number, number, number, number][] = [
  [4, 46, 0, 0.55],
  [9, 30, 6, 0.4],
  [15, 62, -4, 0.28],
  [22, 22, 10, 0.32],
  [30, 48, -8, 0.18],
  [39, 16, 4, 0.22],
  [50, 36, 2, 0.12],
];

interface SeaHorizonProps {
  className?: string;
  /** Altura do horizonte dentro do bloco, em %. */
  horizon?: number;
  /** Cor do brilho central (o sol logo abaixo do horizonte). */
  tone?: 'accent' | 'azure';
  /** Atraso da entrada em segundos. */
  delay?: number;
  /** Até onde os reflexos descem no mar (1 = todo o mar abaixo do horizonte). */
  spread?: number;
}

/**
 * Horizonte noturno: uma linha fina, o brilho de um sol que acabou de se pôr e reflexos
 * horizontais na água. Tudo decorativo, em CSS, e animado uma única vez (classe horizon-in).
 */
export function SeaHorizon({ className, horizon = 62, tone = 'accent', delay = 0.3, spread = 1 }: SeaHorizonProps) {
  const glow = tone === 'accent' ? '255,117,31' : '118,211,246';
  const anim = (extra = 0) => ({ animationDelay: `${delay + extra}s` });

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* Céu: violeta descendo até o horizonte */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${horizon}%`,
          background: 'linear-gradient(to bottom, transparent 20%, rgba(15,3,146,0.28) 75%, rgba(64,20,140,0.35))',
        }}
      />
      {/* Brilho do sol abaixo da linha d'água */}
      <div
        className="horizon-in absolute left-1/2 h-[46%] w-[min(70rem,120%)] -translate-x-1/2 -translate-y-1/2"
        style={{
          top: `${horizon}%`,
          background: `radial-gradient(closest-side, rgba(${glow},0.32), rgba(${glow},0.08) 45%, transparent 72%)`,
          ...anim(),
        }}
      />
      {/* Linha do horizonte */}
      <div
        className="horizon-in absolute inset-x-0 h-px"
        style={{
          top: `${horizon}%`,
          background: `linear-gradient(90deg, transparent, rgba(118,211,246,0.35) 25%, rgba(${glow},0.85) 50%, rgba(118,211,246,0.35) 75%, transparent)`,
          ...anim(0.1),
        }}
      />
      {/* Mar: um pouco mais escuro que o céu */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ top: `${horizon}%`, background: 'linear-gradient(to bottom, rgba(3,0,40,0.55), transparent)' }}
      />
      {REFLECTIONS.map(([dy, width, dx, alpha], i) => (
        <div
          key={i}
          className="horizon-in absolute h-px rounded-full"
          style={{
            top: `calc(${horizon}% + ${(dy * spread * (100 - horizon)) / 100}%)`,
            left: `${50 - width / 2 + dx}%`,
            width: `${width}%`,
            opacity: alpha,
            background: `linear-gradient(90deg, transparent, rgba(${glow},1), transparent)`,
            ...anim(0.25 + i * 0.08),
          }}
        />
      ))}
    </div>
  );
}
