'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CursorTrailProps {
  className?: string;
  /** Cor da cauda do rastro (ponto mais antigo). */
  from?: string;
  /** Cor da ponta do rastro (junto ao cursor). */
  to?: string;
  /** Quanto tempo (ms) cada ponto vive antes de sumir. */
  life?: number;
  /** Espessura máxima do traço, em px. */
  width?: number;
  /** Desfoque aplicado ao canvas, em px — é o que dá o aspecto "líquido". */
  blur?: number;
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Rastro desfocado que segue o mouse, no estilo "liquid glass": um traço grosso que
 * afina e desbota com o tempo, em degradê do índigo (cauda) ao salmão (ponta).
 *
 * O canvas fica por cima de tudo com `pointer-events: none`, então não atrapalha cliques.
 * Em telas de toque e para quem pede menos movimento o efeito não é ligado.
 */
export default function CursorTrail({
  className,
  // Tom mais claro do índigo da marca: o #0f0392 puro some sobre fundos escuros (o hero).
  from = '#1f4fd1',
  to = '#ff751f',
  life = 650,
  width = 26,
  blur = 14,
}: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fromRgb = hexToRgb(from);
    const toRgb = hexToRgb(to);
    const points: TrailPoint[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const now = performance.now();
      while (points.length && now - points[0].t > life) points.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Cada segmento passa pelos pontos médios entre amostras (curva quadrática), o que
      // suaviza o traço mesmo quando o mouse anda rápido e os eventos chegam espaçados.
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const fresh = 1 - (now - curr.t) / life; // 1 = acabou de nascer, 0 = sumindo
        const pos = i / (points.length - 1 || 1); // 0 = cauda, 1 = ponta
        const r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * pos);
        const g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * pos);
        const b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * pos);

        const startX = i === 1 ? prev.x : (points[i - 2].x + prev.x) / 2;
        const startY = i === 1 ? prev.y : (points[i - 2].y + prev.y) / 2;
        const endX = (prev.x + curr.x) / 2;
        const endY = (prev.y + curr.y) / 2;

        // sqrt segura a cor por mais tempo e só desbota no fim da vida do ponto.
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.sqrt(Math.max(fresh, 0)) * 0.95})`;
        ctx.lineWidth = 4 + width * Math.max(fresh, 0);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(prev.x, prev.y, endX, endY);
        ctx.stroke();
      }

      // Com o rastro vazio o laço para; o próximo movimento do mouse o religa.
      frame = points.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [from, to, life, width]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none fixed inset-0 z-[70] h-screen w-screen', className)}
      style={{ filter: `blur(${blur}px)` }}
    />
  );
}
