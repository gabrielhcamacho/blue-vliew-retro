'use client';

import { useRef } from 'react';

/**
 * Detecta swipe horizontal por toque (mobile) e dispara callbacks.
 * Ignora gestos majoritariamente verticais (para não atrapalhar o scroll da página).
 *
 * Retorna `handlers` (para espalhar no elemento) e `swiped` (ref) — útil para
 * suprimir o clique/navegação que o browser dispara ao final de um swipe.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 40,
) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
    swiped.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!start.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.current.x;
    const dy = t.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    }
  };

  return { swiped, handlers: { onTouchStart, onTouchEnd } };
}
