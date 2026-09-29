'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, ImageOff, LayoutGrid, X } from 'lucide-react';
import { isExternalImage } from '@/app/lib/utils';
import { useSwipe } from '@/app/hooks/useSwipe';
import { useModal } from '@/app/hooks/useModal';
import { cn } from '@/lib/utils';

export interface GalleryPhoto {
  src: string;
  /** Dimensões lidas do arquivo no servidor; ausentes quando a leitura falha. */
  width?: number;
  height?: number;
}

interface PropertyGalleryProps {
  /** Fotos na ordem de exibição (a capa escolhida já vem primeiro). */
  photos: GalleryPhoto[];
  title: string;
}

const ratio = (p: GalleryPhoto) => (p.width && p.height ? p.width / p.height : undefined);
const isLandscape = (p: GalleryPhoto) => (ratio(p) ?? 0) >= 1.2;
const pad = (n: number) => String(n).padStart(2, '0');

/** Foto sobre um fundo desfocado dela mesma: mostra a imagem inteira sem faixas vazias. */
function Framed({ photo, sizes, fit = 'contain', eager }: { photo: GalleryPhoto; sizes: string; fit?: 'contain' | 'cover'; eager?: boolean }) {
  const unoptimized = isExternalImage(photo.src);
  return (
    <>
      {fit === 'contain' && (
        <Image
          src={photo.src}
          alt=""
          fill
          aria-hidden
          sizes={sizes}
          unoptimized={unoptimized}
          className="scale-110 object-cover opacity-45 blur-2xl"
        />
      )}
      <Image
        src={photo.src}
        alt=""
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        loading={eager ? 'eager' : undefined}
        fetchPriority={eager ? 'high' : undefined}
        className={cn(
          'transition-transform duration-700 ease-out motion-reduce:transition-none',
          fit === 'cover' ? 'object-cover group-hover:scale-[1.03]' : 'object-contain',
        )}
      />
    </>
  );
}

const tileClass =
  'group relative block overflow-hidden bg-night-soft outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure';

export default function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const n = photos.length;

  if (n === 0) {
    return (
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-night-soft/50 sm:h-56">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-azure/40 to-transparent" />
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
          <ImageOff className="h-4 w-4 text-azure" strokeWidth={1.5} />
          Fotos em breve
        </p>
      </div>
    );
  }

  const openAt = (i: number) => setOpen(i);
  const label = (i: number) => `Abrir foto ${i + 1} de ${n}`;
  const mosaic = n > 1 && isLandscape(photos[0]);

  return (
    <>
      {/* Desktop: mosaico (capa horizontal) ou faixa de fotos verticais */}
      <div className="relative hidden lg:block">
        {mosaic ? (
          <Mosaic photos={photos} onOpen={openAt} label={label} />
        ) : (
          <Strip photos={photos} onOpen={openAt} label={label} />
        )}
        <GalleryBadge n={n} onOpen={() => openAt(0)} />
      </div>

      {/* Mobile e tablet: carrossel com rolagem nativa */}
      <MobileCarousel photos={photos} onOpen={openAt} label={label} />

      {open !== null && (
        <Lightbox photos={photos} title={title} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function GalleryBadge({ n, onOpen }: { n: number; onOpen: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between">
      <span className="rounded-full bg-night/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-azure backdrop-blur-md">
        [ {pad(n)} {n === 1 ? 'foto' : 'fotos'} ]
      </span>
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-night/75 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
      >
        {n === 1 ? <Expand className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        {n === 1 ? 'Ampliar foto' : 'Ver todas as fotos'}
      </button>
    </div>
  );
}

interface LayoutProps {
  photos: GalleryPhoto[];
  onOpen: (i: number) => void;
  label: (i: number) => string;
}

/** Capa horizontal grande à esquerda e até quatro fotos ao lado. */
function Mosaic({ photos, onOpen, label }: LayoutProps) {
  const side = photos.slice(1, 5);
  // Distribuição das fotos laterais conforme a quantidade, sem deixar célula vazia.
  const spans: Record<number, string[]> = {
    1: ['col-span-2 row-span-2'],
    2: ['col-span-2', 'col-span-2'],
    3: ['', '', 'col-span-2'],
    4: ['', '', '', ''],
  };
  return (
    <div className="grid h-[min(62vh,540px)] min-h-[420px] grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl">
      <button type="button" onClick={() => onOpen(0)} aria-label={label(0)} className={cn(tileClass, 'col-span-2 row-span-2')}>
        <Framed photo={photos[0]} sizes="(max-width: 1280px) 50vw, 640px" fit="cover" eager />
      </button>
      {side.map((p, i) => (
        <button
          key={p.src + i}
          type="button"
          onClick={() => onOpen(i + 1)}
          aria-label={label(i + 1)}
          className={cn(tileClass, spans[side.length][i])}
        >
          {/* Foto vertical num quadro horizontal aparece inteira, sem corte. */}
          <Framed photo={p} sizes="(max-width: 1280px) 25vw, 320px" fit={(ratio(p) ?? 0) >= 1 ? 'cover' : 'contain'} />
        </button>
      ))}
    </div>
  );
}

/**
 * Fotos verticais lado a lado, cada uma na própria proporção, sobre o fundo desfocado da
 * capa. Com uma foto só, ela fica inteira no centro.
 */
function Strip({ photos, onOpen, label }: LayoutProps) {
  const shown = photos.slice(0, 3);
  const single = photos.length === 1;
  return (
    <div className="relative h-[min(62vh,540px)] min-h-[420px] overflow-hidden rounded-2xl bg-night-soft">
      <Image
        src={photos[0].src}
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        unoptimized={isExternalImage(photos[0].src)}
        className="scale-110 object-cover opacity-35 blur-3xl"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/10 via-transparent to-night/50" />
      <div className="relative flex h-full justify-center gap-1.5">
        {shown.map((p, i) => {
          const r = ratio(p);
          return (
            <button
              key={p.src + i}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={label(i)}
              className={cn(tileClass, 'h-full min-w-0 shrink bg-transparent', !r && 'flex-1')}
              style={r ? { aspectRatio: String(Math.min(Math.max(r, 0.56), single ? 2.2 : 1)) } : undefined}
            >
              <Framed photo={p} sizes="(max-width: 1280px) 34vw, 420px" fit={r && !single ? 'cover' : 'contain'} eager={i === 0} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileCarousel({ photos, onOpen, label }: LayoutProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const n = photos.length;
  // Moldura na orientação que predomina; fotos na outra orientação ficam inteiras (contain).
  const portraitFirst = photos.filter((p) => (ratio(p) ?? 1) < 1).length >= n / 2;
  const frame = portraitFirst ? 4 / 5 : 4 / 3;

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const step = slide.offsetWidth + 8;
    setCurrent(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:hidden">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => {
          const r = ratio(p);
          const matches = r ? (portraitFirst ? r < 1 : r >= 1) : false;
          return (
            <button
              key={p.src + i}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={label(i)}
              className={cn(
                tileClass,
                'shrink-0 snap-start rounded-xl',
                n === 1 ? 'w-full' : portraitFirst ? 'w-[80%] sm:w-[48%] md:w-[38%]' : 'w-[88%] sm:w-[72%] md:w-[60%]',
              )}
              style={{ aspectRatio: String(frame) }}
            >
              <Framed photo={p} sizes="(max-width: 640px) 88vw, 60vw" fit={matches ? 'cover' : 'contain'} eager={i === 0} />
            </button>
          );
        })}
      </div>
      {n > 1 && (
        <div className="pointer-events-none absolute left-7 top-3 rounded-full bg-night/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-azure backdrop-blur-md sm:left-9" aria-hidden>
          {pad(current + 1)} / {pad(n)}
        </div>
      )}
    </div>
  );
}

interface LightboxProps {
  photos: GalleryPhoto[];
  title: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

function Lightbox({ photos, title, index, onIndex, onClose }: LightboxProps) {
  const panel = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = photos.length;

  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);
  const { handlers } = useSwipe(next, prev);

  useModal(true, onClose, panel);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Home') onIndex(0);
      else if (e.key === 'End') onIndex(n - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [prev, next, onIndex, n]);

  // Mantém a miniatura ativa visível e pré-carrega as vizinhas.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    thumbs.current[index]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    for (const i of [index - 1, index + 1]) {
      const p = photos[(i + n) % n];
      if (p) new window.Image().src = p.src;
    }
  }, [index, n, photos]);

  const photo = photos[index];

  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${title}`}
      className="photo-in fixed inset-0 z-[80] flex flex-col bg-night/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <p className="font-mono text-xs tracking-[0.2em] text-azure" aria-live="polite">
          [ {pad(index + 1)} / {pad(n)} ]
        </p>
        <p className="hidden min-w-0 flex-1 truncate text-center text-sm text-white/70 sm:block">{title}</p>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Fechar galeria"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 touch-pan-y select-none" {...handlers}>
        <Image
          key={photo.src + index}
          src={photo.src}
          alt={`${title}: foto ${index + 1} de ${n}`}
          fill
          sizes="100vw"
          unoptimized={isExternalImage(photo.src)}
          className="photo-in object-contain p-2 sm:p-6"
        />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-night/70 text-white backdrop-blur-md transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-night/70 text-white backdrop-blur-md transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="border-t border-white/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto p-1 [scrollbar-width:thin]">
            {photos.map((p, i) => (
              <button
                key={p.src + i}
                ref={(el) => {
                  thumbs.current[i] = el;
                }}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-md outline-none ring-offset-2 ring-offset-night transition-opacity focus-visible:ring-2 focus-visible:ring-azure',
                  i === index ? 'opacity-100 ring-2 ring-accent' : 'opacity-50 hover:opacity-90',
                )}
              >
                <Image src={p.src} alt="" fill sizes="80px" unoptimized={isExternalImage(p.src)} className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
