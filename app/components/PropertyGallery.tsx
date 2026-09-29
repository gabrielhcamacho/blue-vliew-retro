'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isExternalImage } from '@/app/lib/utils';
import { useSwipe } from '@/app/hooks/useSwipe';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  const { handlers: swipeHandlers } = useSwipe(next, prev);

  if (!images || images.length === 0) return null;

  // Mantém montadas a imagem atual e as vizinhas (anterior/próxima) para pré-carregá-las,
  // tornando a troca instantânea ao clicar em avançar/voltar.
  const n = images.length;
  const keep = new Set([index, (index - 1 + n) % n, (index + 1) % n]);

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-card touch-pan-y select-none" {...swipeHandlers}>
        {images.map((img, i) =>
          keep.has(i) ? (
            <Image
              key={i}
              src={img}
              alt={title}
              fill
              className={`object-contain transition-opacity duration-200 ${
                i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              sizes="(max-width: 1200px) 100vw, 66vw"
              priority={i === index}
              loading={i === index ? undefined : 'eager'}
              unoptimized={isExternalImage(img)}
            />
          ) : null
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 right-3 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                i === index ? 'border-azure' : 'border-transparent'
              }`}
            >
              <Image src={img} alt="" width={64} height={48} className="w-full h-full object-cover" unoptimized={isExternalImage(img)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
