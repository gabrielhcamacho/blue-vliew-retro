'use client';

import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';
import PillLink from '@/app/components/PillLink';
import { useFavorites } from '@/app/hooks/useFavorites';
import PropertyCard from '@/app/components/PropertyCard';
import PropertyCardSkeleton from '@/app/components/PropertyCardSkeleton';
import type { Property } from '@/app/lib/types';

interface Props {
  allProperties: Property[];
}

/** Espaços vazios no formato dos cards, onde os imóveis salvos vão aparecer. */
function EmptySlots() {
  return (
    <div aria-hidden className="mx-auto mb-9 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={
            i === 1
              ? 'relative flex aspect-[4/3] items-center justify-center rounded-2xl border border-azure/40 bg-gradient-to-b from-primary/40 to-night-soft shadow-[0_0_50px_-12px_rgba(118,211,246,0.45)]'
              : 'aspect-[4/3] translate-y-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02]'
          }
        >
          {i === 1 && (
            <>
              <div className="scanlines pointer-events-none absolute inset-0 rounded-2xl" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-night/70 ring-1 ring-white/15">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/25 [animation-duration:2.4s] motion-reduce:hidden" />
                <Bookmark className="relative h-5 w-5 text-white" />
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FavoritosClient({ allProperties }: Props) {
  const { favorites, ready } = useFavorites();

  const favProperties = allProperties.filter((p) => favorites.includes(p.id));

  // Enquanto lê o que ficou salvo no navegador, mostra o formato da grade
  if (!ready) {
    return (
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 [&_.animate-pulse]:motion-reduce:animate-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-night-soft/70 to-night px-6 pb-14 pt-12 text-center sm:pb-16 sm:pt-14">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-[40rem] max-w-full -translate-x-1/2 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,117,31,0.16), transparent)' }}
        />
        <div className="relative">
          <EmptySlots />
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-azure">[ 0 ] imóveis salvos</p>
          <h2 className="mb-3 font-display text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
            Sua seleção começa aqui.
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Toque no marcador de qualquer imóvel para salvá-lo. Ele fica guardado neste navegador para
            você comparar com calma.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <PillLink href="/imoveis">Explorar imóveis</PillLink>
            <Link
              href="/imoveis?status_imovel=lancamento"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-azure"
            >
              Ver lançamentos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-medium tracking-[-0.04em] text-white">{favProperties.length}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
            imóve{favProperties.length !== 1 ? 'is' : 'l'} salvo{favProperties.length !== 1 ? 's' : ''}
          </span>
        </p>
        <Link
          href="/imoveis"
          className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-azure"
        >
          Continuar explorando
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>

      {favProperties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 py-16 text-center">
          <p className="text-sm text-white/55">
            Os imóveis que você salvou não estão mais disponíveis no portfólio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          {favProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </>
  );
}
