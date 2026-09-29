'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ─── Filter definitions ───────────────────────────────────────────────────────

const tipologias = [
  { label: '1 Suíte', value: '1s' },
  { label: '1 Suíte + 1 Dormitório', value: '1s1d' },
  { label: '1 Suíte + 2 Dormitórios', value: '1s2d' },
  { label: '1 Suíte + 3 Dormitórios', value: '1s3d' },
  { label: '2 Suítes', value: '2s' },
  { label: '3 Suítes', value: '3s' },
  { label: '4 Suítes', value: '4s' },
  { label: '5 Suítes', value: '5s' },
];

const metragens = [
  { label: 'Até 50m²', value: 'ate50' },
  { label: '50m² a 100m²', value: '50_100' },
  { label: '100m² a 150m²', value: '100_150' },
  { label: '150m² a 200m²', value: '150_200' },
  { label: '200m² a 300m²', value: '200_300' },
  { label: 'Acima de 300m²', value: 'acima300' },
];

const tiposApt = [
  { label: 'Flat / Studio', value: 'flat' },
  { label: 'Apartamento Tipo', value: 'apartamento' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Cobertura', value: 'cobertura' },
  { label: 'Garden', value: 'garden' },
  { label: 'Diferenciado com Terraço', value: 'diferenciado' },
];

const statusOptions = [
  { label: 'Lançamento', value: 'lancamento' },
  { label: 'Em Construção', value: 'construcao' },
  { label: 'Pronto sem Mobília', value: 'pronto' },
  { label: 'Pronto Mobiliado', value: 'pronto_mobiliado' },
];

const cidadeOptions = [
  { label: 'Itapema', value: 'Itapema' },
  { label: 'Balneário Camboriú', value: 'Balneário Camboriú' },
];

const regiaoOptions = [
  { label: 'Frente Mar', value: 'frente_mar' },
  { label: 'Quadra Mar', value: 'quadra_mar' },
  { label: 'Segunda Quadra', value: 'segunda_quadra' },
  { label: 'Terceira Quadra', value: 'terceira_quadra' },
];

const faixaPrecos = [
  { label: 'Até R$ 500 mil', value: 'ate500' },
  { label: 'R$ 500 mil a R$ 1 mi', value: '500_1000' },
  { label: 'R$ 1 mi a R$ 1,5 mi', value: '1000_1500' },
  { label: 'R$ 1,5 mi a R$ 3 mi', value: '1500_3000' },
  { label: 'R$ 3 mi a R$ 5 mi', value: '3000_5000' },
  { label: 'R$ 5 mi a R$ 6,5 mi', value: '5000_6500' },
  { label: 'R$ 6,5 mi a R$ 8 mi', value: '6500_8000' },
  { label: 'R$ 8 mi a R$ 10 mi', value: '8000_10000' },
  { label: 'Acima de R$ 10 mi', value: 'acima10000' },
];

const sortOptions = [
  { label: 'Mais recentes', value: '' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Maior área', value: 'area_desc' },
];

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-semibold text-white/90 py-2"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 text-white/45 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

// ─── Radio group helper ───────────────────────────────────────────────────────

function RadioList({
  options,
  param,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  param: string;
  value: string;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {options.map((o) => (
        <li key={o.value}>
          <button
            onClick={() => onChange(param, value === o.value ? '' : o.value)}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              value === o.value
                ? 'bg-accent/15 text-[#ff751f] font-medium'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                value === o.value ? 'border-[#ff751f]' : 'border-white/20'
              }`}
            >
              {value === o.value && (
                <span className="w-2 h-2 rounded-full bg-[#ff751f]" />
              )}
            </span>
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const allFilterKeys = [
  'city', 'tipologia', 'metragem', 'tipo_apt',
  'status_imovel', 'regiao', 'faixa_preco', 'sort',
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) || '';

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/imoveis?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push('/imoveis');

  const hasFilters = allFilterKeys.some((k) => !!searchParams.get(k));

  return (
    <aside className="w-full space-y-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-white text-base">Filtros</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="border-b border-border pb-4">
        <label className="block text-sm font-semibold text-white/90 mb-2">Ordenar por</label>
        <select
          value={get('sort')}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-1 focus:ring-azure"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cidade */}
      <Section title="Cidade">
        <RadioList
          options={cidadeOptions}
          param="city"
          value={get('city')}
          onChange={update}
        />
      </Section>

      {/* Tipologias */}
      <Section title="Tipologias">
        <RadioList
          options={tipologias}
          param="tipologia"
          value={get('tipologia')}
          onChange={update}
        />
      </Section>

      {/* Metragens */}
      <Section title="Metragem Privativa">
        <RadioList
          options={metragens}
          param="metragem"
          value={get('metragem')}
          onChange={update}
        />
      </Section>

      {/* Tipo apartamento */}
      <Section title="Tipo de Apartamento" defaultOpen={false}>
        <RadioList
          options={tiposApt}
          param="tipo_apt"
          value={get('tipo_apt')}
          onChange={update}
        />
      </Section>

      {/* Status */}
      <Section title="Status do Imóvel" defaultOpen={false}>
        <RadioList
          options={statusOptions}
          param="status_imovel"
          value={get('status_imovel')}
          onChange={update}
        />
      </Section>

      {/* Região */}
      <Section title="Região" defaultOpen={false}>
        <RadioList
          options={regiaoOptions}
          param="regiao"
          value={get('regiao')}
          onChange={update}
        />
      </Section>

      {/* Faixa de valores */}
      <Section title="Faixa de Valores">
        <RadioList
          options={faixaPrecos}
          param="faixa_preco"
          value={get('faixa_preco')}
          onChange={update}
        />
      </Section>
    </aside>
  );
}
