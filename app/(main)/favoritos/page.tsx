import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fetchAllProperties } from '@/app/lib/rehut-api';
import { BRAND_ARC, BRAND_WAVE } from '@/components/ui/brand-paths';
import FavoritosClient from './FavoritosClient';

export const metadata: Metadata = {
  title: 'Meus Favoritos | Blueview Imóveis',
  description: 'Imóveis salvos por você na Blueview Imóveis.',
};

/** Marcador de favorito sob a curva da marca: o detalhe do cabeçalho. */
function SavedMark() {
  return (
    <svg aria-hidden viewBox="0 0 1200 760" fill="none" className="h-20 w-28 shrink-0 sm:h-24 sm:w-32">
      <path d={BRAND_ARC} stroke="#ff751f" strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={0.8} />
      <path d={BRAND_WAVE} stroke="#76d3f6" strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={0.8} />
      <path
        d="M510 330 h180 v400 l-90 -70 l-90 70 Z"
        fill="rgba(255,117,31,0.12)"
        stroke="#ffffff"
        strokeOpacity={0.7}
        strokeWidth={1.25}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default async function FavoritosPage() {
  const raw = await fetchAllProperties({});

  return (
    <div className="bg-night min-h-screen">
      <header className="relative px-4 pt-24 sm:px-6 md:pt-28 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 pb-6">
          <div className="min-w-0">
            <nav aria-label="Trilha" className="mb-4 flex items-center gap-1.5 text-xs text-white/50">
              <Link href="/" className="transition-colors hover:text-white">Início</Link>
              <ChevronRight className="h-3 w-3 text-white/35" />
              <span className="text-white/80">Meus favoritos</span>
            </nav>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-azure">[ Favoritos ] Sua seleção</p>
            <h1 className="font-display text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">Meus favoritos</h1>
            <p className="mt-2 max-w-md text-sm text-white/55">Os imóveis que você salvou ficam guardados neste navegador.</p>
          </div>
          <div className="hidden sm:block">
            <SavedMark />
          </div>
        </div>
        {/* Linha de transição para o conteúdo */}
        <div aria-hidden className="mx-auto h-px max-w-7xl bg-gradient-to-r from-accent via-azure/50 to-transparent" />
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <Suspense fallback={<div className="text-white/45 text-sm">Carregando...</div>}>
          <FavoritosClient allProperties={raw.data} />
        </Suspense>
      </div>
    </div>
  );
}
