'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isExternalImage } from '@/app/lib/utils';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  sizes?: string;
  showCounter?: boolean;
}

/**
 * Carrossel de imagens arrastável (drag-follow): durante o toque o track segue o dedo;
 * ao soltar, faz "snap" para a próxima/anterior conforme o deslocamento (senão volta).
 * Mantém as setas (desktop) e o scroll vertical da página (touch-action: pan-y).
 */
export default function ImageCarousel({ images, alt, sizes, showCounter = true }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dir = useRef<'h' | 'v' | null>(null);
  const didDrag = useRef(false);
  const width = useRef(0);

  const n = images.length;
  const last = n - 1;

  const clampIndex = (i: number) => Math.max(0, Math.min(last, i));
  const go = (i: number) => setIndex(clampIndex(i));

  const onPointerDown = (e: React.PointerEvent) => {
    if (n <= 1 || e.pointerType === 'mouse') return;
    start.current = { x: e.clientX, y: e.clientY };
    dir.current = null;
    didDrag.current = false;
    width.current = containerRef.current?.offsetWidth ?? 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;

    if (dir.current === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      dir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (dir.current === 'v') {
        start.current = null; // gesto vertical → deixa a página rolar
        return;
      }
      setDragging(true);
    }
    if (dir.current !== 'h') return;

    // Resistência nas pontas (não há wrap)
    let d = dx;
    if ((index === 0 && dx > 0) || (index === last && dx < 0)) d = dx * 0.35;
    didDrag.current = true;
    setDragPx(d);
  };

  const endDrag = () => {
    if (!dragging) {
      start.current = null;
      dir.current = null;
      return;
    }
    const threshold = Math.min((width.current || 1) * 0.25, 80);
    if (dragPx <= -threshold && index < last) go(index + 1);
    else if (dragPx >= threshold && index > 0) go(index - 1);
    setDragPx(0);
    setDragging(false);
    start.current = null;
    dir.current = null;
  };

  if (n === 0) {
    return (
      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
        <span className="text-white/45 text-sm">Sem foto</span>
      </div>
    );
  }

  const window = new Set([index - 1, index, index + 1]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden touch-pan-y select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        // Se acabou de arrastar, não deixa o clique navegar (o card é um <Link>).
        if (didDrag.current) {
          e.preventDefault();
          e.stopPropagation();
          didDrag.current = false;
        }
      }}
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragPx}px))`,
          transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.22,0.61,0.36,1)',
        }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0 bg-white/5">
            {window.has(i) && (
              <Image
                src={img}
                alt={alt}
                fill
                className="object-cover"
                sizes={sizes}
                unoptimized={isExternalImage(img)}
                loading={i === index ? undefined : 'eager'}
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(index - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white/10 flex items-center justify-center shadow transition-colors z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-4 h-4 text-white/80" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(index + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white/10 flex items-center justify-center shadow transition-colors z-10"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-4 h-4 text-white/80" />
          </button>
          {showCounter && (
            <span className="absolute bottom-2 right-3 text-xs text-white bg-black/50 rounded-full px-2 py-0.5 z-10">
              {index + 1}/{n}
            </span>
          )}
        </>
      )}
    </div>
  );
}
