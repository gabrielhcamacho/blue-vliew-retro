'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PerspectiveFlipCardProps {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  h?: string;
  w?: string;
  /**
   * Força o verso visível. No desktop o giro vem do hover (o `group-hover` do Tailwind v4 só
   * vale em aparelhos com hover), então este controle existe para telas de toque.
   */
  flipped?: boolean;
}

/**
 * Card 14 - Perspective Flip Card
 * Frente e verso em 3D: os filhos usam `translateZ` para "saltar" do card durante o giro.
 * As faces não têm overflow-hidden de propósito, senão a translação em Z seria achatada.
 */
export function PerspectiveFlipCard({
  className,
  front,
  back,
  h = 'h-[500px]',
  w = 'w-[360px]',
  flipped = false,
}: PerspectiveFlipCardProps) {
  return (
    <div className={cn('group/p-card [perspective:2000px]', h, w, className)}>
      <div
        className={cn(
          'relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] group-hover/p-card:[transform:rotateY(180deg)]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 size-full rounded-2xl border border-border bg-card text-card-foreground [backface-visibility:hidden] [transform-style:preserve-3d]">
          <div className="size-full p-3 [transform-style:preserve-3d]">{front}</div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 size-full rounded-2xl border border-border bg-card text-card-foreground [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(180deg)]">
          <div className="flex size-full flex-col items-center justify-center p-8 text-center [transform-style:preserve-3d]">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}
