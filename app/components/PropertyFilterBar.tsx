'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BeamSearch } from '@/components/ui/beam-search';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

// ─── Filter definitions ───────────────────────────────────────────────────────

const filterGroups = [
  {
    id: 'localizacao',
    label: 'Localização',
    params: ['city', 'regiao'],
    sections: [
      {
        title: 'Cidade',
        param: 'city',
        options: [
          { label: 'Itapema', value: 'Itapema' },
          { label: 'Balneário Camboriú', value: 'Balneário Camboriú' },
        ],
      },
      {
        title: 'Região',
        param: 'regiao',
        options: [
          { label: 'Frente Mar', value: 'frente_mar' },
          { label: 'Quadra Mar', value: 'quadra_mar' },
          { label: 'Segunda Quadra', value: 'segunda_quadra' },
          { label: 'Terceira Quadra', value: 'terceira_quadra' },
        ],
      },
    ],
  },
  {
    id: 'tipo',
    label: 'Tipo de Imóvel',
    params: ['tipo_apt'],
    sections: [
      {
        title: 'Tipo',
        param: 'tipo_apt',
        options: [
          { label: 'Flat / Studio', value: 'flat' },
          { label: 'Apartamento', value: 'apartamento' },
          { label: 'Duplex', value: 'duplex' },
          { label: 'Cobertura', value: 'cobertura' },
          { label: 'Garden', value: 'garden' },
          { label: 'Diferenciado', value: 'diferenciado' },
        ],
      },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    params: ['status_imovel'],
    sections: [
      {
        title: 'Status',
        param: 'status_imovel',
        options: [
          { label: 'Lançamento', value: 'lancamento' },
          { label: 'Em Construção', value: 'construcao' },
          { label: 'Pronto', value: 'pronto' },
          { label: 'Pronto Mobiliado', value: 'pronto_mobiliado' },
        ],
      },
    ],
  },
  {
    id: 'tipologia',
    label: 'Tipologia',
    params: ['tipologia'],
    sections: [
      {
        title: 'Suítes',
        param: 'tipologia',
        options: [
          { label: '1 Suíte', value: '1s' },
          { label: '1 Suíte + 1 Dorm.', value: '1s1d' },
          { label: '2 Suítes', value: '2s' },
          { label: '3 Suítes', value: '3s' },
          { label: '4 Suítes', value: '4s' },
          { label: '5 Suítes', value: '5s' },
        ],
      },
    ],
  },
  {
    id: 'preco',
    label: 'Preço',
    params: ['faixa_preco'],
    sections: [
      {
        title: 'Faixa de Valores',
        param: 'faixa_preco',
        options: [
          { label: 'Até R$ 500 mil', value: 'ate500' },
          { label: 'R$ 500 mil a R$ 1 mi', value: '500_1000' },
          { label: 'R$ 1 mi a R$ 1,5 mi', value: '1000_1500' },
          { label: 'R$ 1,5 mi a R$ 3 mi', value: '1500_3000' },
          { label: 'R$ 3 mi a R$ 5 mi', value: '3000_5000' },
          { label: 'R$ 5 mi a R$ 6,5 mi', value: '5000_6500' },
          { label: 'R$ 6,5 mi a R$ 8 mi', value: '6500_8000' },
          { label: 'R$ 8 mi a R$ 10 mi', value: '8000_10000' },
          { label: 'Acima de R$ 10 mi', value: 'acima10000' },
        ],
      },
    ],
  },
  {
    id: 'metragem',
    label: 'Metragem',
    params: ['metragem'],
    sections: [
      {
        title: 'Área Privativa',
        param: 'metragem',
        options: [
          { label: 'Até 50m²', value: 'ate50' },
          { label: '50m² a 100m²', value: '50_100' },
          { label: '100m² a 150m²', value: '100_150' },
          { label: '150m² a 200m²', value: '150_200' },
          { label: '200m² a 300m²', value: '200_300' },
          { label: 'Acima de 300m²', value: 'acima300' },
        ],
      },
    ],
  },
];

const ALL_FILTER_KEYS = [
  'search', 'city', 'tipologia', 'metragem',
  'tipo_apt', 'status_imovel', 'regiao', 'faixa_preco',
];

const SORT_OPTIONS = [
  { label: 'Mais recentes', value: '' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Maior área', value: 'area_desc' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyFilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [openId, setOpenId] = useState<string | null>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(sp.get('search') ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Mantém o input sincronizado com a URL (ex.: navegação/back)
  useEffect(() => { setSearchInput(sp.get('search') ?? ''); }, [sp]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openId) return;
    const fn = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      setOpenId(null);
      setDropdownRect(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [openId]);

  const get = (k: string) => sp.get(k) ?? '';

  const navigate = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    params.delete('page');
    router.push(`/imoveis?${params.toString()}`);
  }, [router, sp]);

  const submitSearch = () => {
    if (searchInput.trim() !== (sp.get('search') ?? '')) navigate({ search: searchInput.trim() });
    setOpenId(null);
    setDropdownRect(null);
  };

  const handleToggle = (groupId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openId === groupId) {
      setOpenId(null);
      setDropdownRect(null);
    } else {
      setDropdownRect(e.currentTarget.getBoundingClientRect());
      setOpenId(groupId);
    }
  };

  const toggle = (param: string, value: string) => {
    navigate({ [param]: get(param) === value ? '' : value });
    setOpenId(null);
    setDropdownRect(null);
  };

  const hasFilters = ALL_FILTER_KEYS.some((k) => !!sp.get(k));

  const getActiveLabel = (group: (typeof filterGroups)[0]) => {
    for (const sec of group.sections) {
      const v = get(sec.param);
      if (v) return sec.options.find((o) => o.value === v)?.label ?? null;
    }
    return null;
  };

  const isGroupActive = (group: (typeof filterGroups)[0]) =>
    group.params.some((p) => !!get(p));

  const openGroup = filterGroups.find((g) => g.id === openId);

  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 h-14">

          {/* Busca por nome do imóvel */}
          <BeamSearch
            size="sm"
            value={searchInput}
            onValueChange={setSearchInput}
            onSubmit={submitSearch}
            onBlur={submitSearch}
            placeholder="Buscar por nome"
            shortcut
            className="shrink-0 w-44 sm:w-64"
          />

          {/* Divider */}
          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Scrollable filter pills */}
          <div
            className="flex items-center gap-1.5 flex-1 min-w-0 pr-2"
            style={{ overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none' }}
          >
            <SlidersHorizontal className="w-4 h-4 text-white/45 shrink-0 mr-1" />

            {filterGroups.map((group) => {
              const active = isGroupActive(group);
              const isOpen = openId === group.id;
              const activeLabel = getActiveLabel(group);

              return (
                <button
                  key={group.id}
                  onClick={(e) => handleToggle(group.id, e)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#ff751f] border-[#ff751f] text-white'
                      : 'bg-card border-border text-white/80 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {activeLabel ?? group.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    } ${active ? 'text-white/70' : 'text-white/45'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Sort */}
          <div className="relative shrink-0">
            <select
              value={get('sort')}
              onChange={(e) => { navigate({ sort: e.target.value }); setOpenId(null); }}
              className="appearance-none text-sm text-white/70 bg-card border border-border rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-azure focus:border-azure"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/45 pointer-events-none" />
          </div>
        </div>

        {/* Limpar filtros — linha própria abaixo da barra para não ficar cortado */}
        {hasFilters && (
          <div className="flex pb-2.5 -mt-0.5">
            <button
              onClick={() => { router.push('/imoveis'); setOpenId(null); }}
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium px-3 py-1.5 rounded-full border border-red-500/30 hover:bg-red-500/10 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Dropdown portal — renders at document.body to escape overflow clipping */}
      {mounted && openGroup && dropdownRect && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownRect.bottom + 8,
            left: dropdownRect.left,
            zIndex: 9999,
          }}
          className="bg-card rounded-xl shadow-xl border border-border overflow-hidden min-w-[210px]"
        >
          <div className="p-2">
            {openGroup.sections.map((sec, si) => (
              <div key={sec.param}>
                {openGroup.sections.length > 1 && (
                  <p
                    className={`text-[10px] font-bold text-white/45 uppercase tracking-wider px-2 pb-1 ${
                      si > 0 ? 'pt-2 mt-1 border-t border-border' : 'pt-1'
                    }`}
                  >
                    {sec.title}
                  </p>
                )}
                {sec.options.map((opt) => {
                  const selected = get(sec.param) === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggle(sec.param, opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selected
                          ? 'bg-accent/15 text-[#ff751f] font-semibold'
                          : 'text-white/80 hover:bg-white/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
