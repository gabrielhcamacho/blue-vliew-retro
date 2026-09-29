import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fetchAllProperties } from '@/app/lib/rehut-api';
import { normalizeText } from '@/app/lib/utils';
import PropertyCard from '@/app/components/PropertyCard';
import PropertyFilterBar from '@/app/components/PropertyFilterBar';
import FeatureChips, { type FeatureChip } from '@/app/components/FeatureChips';
import type { Property, PropertyFilters as Filters } from '@/app/lib/types';

export const metadata: Metadata = {
  title: 'Imóveis à Venda e para Alugar | Blueview Imóveis',
  description:
    'Explore o portfólio completo da Blueview: apartamentos de alto padrão, coberturas, gardens e lançamentos em Itapema e região.',
};

// ─── Decoders (same as before) ────────────────────────────────────────────────

function decodeFaixaPreco(faixa: string): { min?: number; max?: number } {
  switch (faixa) {
    case 'ate500':      return { max: 500_000 };
    case '500_1000':    return { min: 500_001,   max: 1_000_000 };
    case '1000_1500':   return { min: 1_000_001,  max: 1_500_000 };
    case '1500_3000':   return { min: 1_500_001,  max: 3_000_000 };
    case '3000_5000':   return { min: 3_000_001,  max: 5_000_000 };
    case '5000_6500':   return { min: 5_000_001,  max: 6_500_000 };
    case '6500_8000':   return { min: 6_500_001,  max: 8_000_000 };
    case '8000_10000':  return { min: 8_000_001,  max: 10_000_000 };
    case '5000_10000':  return { min: 5_000_001,  max: 10_000_000 };
    case 'acima10000':  return { min: 10_000_001 };
    default:            return {};
  }
}

function decodeTipologia(tip: string): { suites: number; extraBedrooms: number } | null {
  const m = tip.match(/^(\d+)s(?:(\d+)d)?$/);
  if (!m) return null;
  return { suites: parseInt(m[1]), extraBedrooms: m[2] ? parseInt(m[2]) : 0 };
}

function decodeMetragem(met: string): { min?: number; max?: number } {
  switch (met) {
    case 'ate50':      return { max: 50 };
    case '50_100':     return { min: 50,  max: 100 };
    case '100_150':    return { min: 100, max: 150 };
    case '150_200':    return { min: 150, max: 200 };
    case '200_300':    return { min: 200, max: 300 };
    case 'acima300':   return { min: 300 };
    default:           return {};
  }
}

const regiaoKeywords: Record<string, string[]> = {
  frente_mar:      ['frente mar', 'beira mar', 'orla', 'frente ao mar'],
  quadra_mar:      ['quadra mar', 'primeira quadra', '1a quadra', '1ª quadra'],
  segunda_quadra:  ['segunda quadra', '2a quadra', '2ª quadra'],
  terceira_quadra: ['terceira quadra', '3a quadra', '3ª quadra'],
};

// ─── Filters & sort ───────────────────────────────────────────────────────────

function applyFilters(properties: Property[], params: Filters): Property[] {
  let list = [...properties];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.property_code, p.neighborhood, p.address, p.city]
          .some((field) => (field ?? '').toLowerCase().includes(q))
      );
    }
  }

  if (params.tipologia) {
    const tip = decodeTipologia(params.tipologia);
    if (tip) {
      list = list.filter((p) => {
        if (p.suites !== tip.suites) return false;
        if (tip.extraBedrooms > 0) {
          return Math.max(0, p.bedrooms - p.suites) === tip.extraBedrooms;
        }
        return true;
      });
    }
  }

  if (params.metragem) {
    const { min, max } = decodeMetragem(params.metragem);
    list = list.filter((p) => {
      const area = p.area_private ?? p.area_total ?? 0;
      if (min !== undefined && area < min) return false;
      if (max !== undefined && area > max) return false;
      return true;
    });
  }

  if (params.tipo_apt) {
    list = list.filter(
      (p) => (p.property_type ?? '').toLowerCase() === params.tipo_apt!.toLowerCase()
    );
  }

  if (params.status_imovel) {
    // Sem acento dos dois lados: a API devolve `lancamento`/`construcao`, mas a situação
    // digitada no CRM pode vir acentuada.
    const val = normalizeText(params.status_imovel.replace(/_/g, ' '));
    list = list.filter((p) => normalizeText(p.property_situation).includes(val));
  }

  if (params.regiao) {
    const keywords = regiaoKeywords[params.regiao] ?? [];
    list = list.filter((p) => {
      const hay = (p.neighborhood + ' ' + (p.property_situation ?? '')).toLowerCase();
      return keywords.some((kw) => hay.includes(kw));
    });
  }

  if (params.faixa_preco) {
    const { min, max } = decodeFaixaPreco(params.faixa_preco);
    list = list.filter((p) => {
      const price = p.price ?? p.rental_price ?? 0;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      return true;
    });
  }

  return list;
}

function applySort(properties: Property[], sort: string): Property[] {
  const list = [...properties];
  switch (sort) {
    case 'price_asc':  return list.sort((a, b) => (a.price ?? a.rental_price ?? 0) - (b.price ?? b.rental_price ?? 0));
    case 'price_desc': return list.sort((a, b) => (b.price ?? b.rental_price ?? 0) - (a.price ?? a.rental_price ?? 0));
    case 'area_desc':  return list.sort((a, b) => (b.area_private ?? b.area_total ?? 0) - (a.area_private ?? a.area_total ?? 0));
    default:           return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

// ─── Feature chip counts (from full unfiltered dataset) ───────────────────────

function countByRegiao(all: Property[], regiao: string): number {
  const keywords = regiaoKeywords[regiao] ?? [];
  return all.filter((p) => {
    const hay = (p.neighborhood + ' ' + (p.property_situation ?? '')).toLowerCase();
    return keywords.some((kw) => hay.includes(kw));
  }).length;
}

// Conta pela SITUAÇÃO do imóvel (`property_situation`), que é o mesmo campo usado pelo filtro
// `status_imovel` em applyFilters. Antes lia `status`, que guarda o ciclo de vida do anúncio
// (`active`/`inactive`/`sold`) — o contador dava zero para qualquer situação.
function countBySituation(all: Property[], situation: string): number {
  const target = normalizeText(situation);
  return all.filter((p) => normalizeText(p.property_situation).includes(target)).length;
}

function countByType(all: Property[], type: string): number {
  return all.filter((p) => (p.property_type ?? '').toLowerCase() === type).length;
}

// ─── Page ────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<Filters & { sort?: string }>;
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  const raw = await fetchAllProperties({
    purpose: params.purpose,
    city: params.city,
  });

  const filtered = applyFilters(raw.data, params);
  const sorted = applySort(filtered, params.sort || '');

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const slice = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function buildPageUrl(p: number) {
    const q = new URLSearchParams(params as Record<string, string>);
    q.set('page', String(p));
    return `/imoveis?${q.toString()}`;
  }

  const activeCount = [
    'search', 'city', 'tipologia', 'metragem', 'tipo_apt',
    'status_imovel', 'regiao', 'faixa_preco',
  ].filter((k) => !!(params as Record<string, string>)[k]).length;

  // Build feature chips with counts from full dataset
  const featureChips: FeatureChip[] = [
    { label: 'Frente Mar',      param: 'regiao',       value: 'frente_mar',       count: countByRegiao(raw.data, 'frente_mar') },
    { label: 'Quadra Mar',      param: 'regiao',       value: 'quadra_mar',       count: countByRegiao(raw.data, 'quadra_mar') },
    { label: 'Lançamento',      param: 'status_imovel', value: 'lancamento',      count: countBySituation(raw.data, 'lancamento') },
    { label: 'Cobertura',       param: 'tipo_apt',     value: 'cobertura',        count: countByType(raw.data, 'cobertura') },
    { label: 'Garden',          param: 'tipo_apt',     value: 'garden',           count: countByType(raw.data, 'garden') },
    { label: 'Em Construção',   param: 'status_imovel', value: 'construcao',      count: countBySituation(raw.data, 'construcao') },
  ];

  return (
    <div className="bg-night min-h-screen pt-20">
      {/* Sticky filter bar — sticks just below the fixed header (top-20 = 80px) */}
      <div className="sticky top-20 z-40">
        <Suspense fallback={<div className="h-14 bg-card border-b border-border" />}>
          <PropertyFilterBar />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/45" />
          <span className="text-white font-medium">Imóveis</span>
        </nav>

        {/* Feature chips */}
        <div className="mb-5">
          <Suspense fallback={null}>
            <FeatureChips chips={featureChips} />
          </Suspense>
        </div>

        {/* Results header */}
        <div className="flex items-baseline gap-3 mb-8">
          <span className="font-display text-5xl font-medium tracking-[-0.04em] text-white">
            {total}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-azure">
            imóveis encontrados
            {activeCount > 0 && (
              <span className="ml-1 text-white/45">
                · {activeCount} filtro{activeCount > 1 ? 's' : ''} ativo{activeCount > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>

        {/* Card grid or empty state */}
        {slice.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <p className="text-white/60 text-lg mb-2 font-medium">Nenhum imóvel encontrado</p>
            <p className="text-white/45 text-sm mb-5">Ajuste os filtros ou limpe a busca para ver todo o portfólio</p>
            <Link
              href="/imoveis"
              className="btn-primary inline-block text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Limpar filtros
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
              {slice.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                {page > 1 && (
                  <a
                    href={buildPageUrl(page - 1)}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-white/80 bg-card hover:bg-white/5 transition-colors"
                  >
                    ← Anterior
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <a
                      key={p}
                      href={buildPageUrl(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'text-white'
                          : 'border border-border text-white/80 bg-card hover:bg-white/5'
                      }`}
                      style={p === page ? { backgroundColor: '#ff751f' } : {}}
                    >
                      {p}
                    </a>
                  ))}
                {page < totalPages && (
                  <a
                    href={buildPageUrl(page + 1)}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-white/80 bg-card hover:bg-white/5 transition-colors"
                  >
                    Próxima →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
