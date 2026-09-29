'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { BeamSearch } from '@/components/ui/beam-search';
import { cn } from '@/lib/utils';

const cities = [
  { label: 'Itapema', value: 'Itapema' },
  { label: 'Balneário Camboriú', value: 'Balneário Camboriú' },
];

const propertyTypes = [
  { label: 'Todos os tipos', value: '' },
  { label: 'Apartamento', value: 'apartamento' },
  { label: 'Cobertura', value: 'cobertura' },
  { label: 'Flat / Studio', value: 'flat' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Garden', value: 'garden' },
  { label: 'Terreno', value: 'terreno' },
];

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Na planta', value: 'lancamento' },
  { label: 'Mobiliado', value: 'pronto_mobiliado' },
  { label: 'Sem mobília', value: 'pronto' },
];

const priceRanges = [
  { label: 'Qualquer valor', value: '' },
  { label: 'Até R$ 500 mil', value: 'ate500' },
  { label: 'R$ 500 mil a R$ 1 mi', value: '500_1000' },
  { label: 'R$ 1 mi a R$ 1,5 mi', value: '1000_1500' },
  { label: 'R$ 1,5 mi a R$ 3 mi', value: '1500_3000' },
  { label: 'R$ 3 mi a R$ 5 mi', value: '3000_5000' },
  { label: 'R$ 5 mi a R$ 10 mi', value: '5000_10000' },
  { label: 'Acima de R$ 10 mi', value: 'acima10000' },
];

interface FilterFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

/** Filtro com superfície própria: rótulo em mono dentro do campo e o valor logo abaixo. */
function FilterField({ label, value, onChange, options }: FilterFieldProps) {
  const id = useId();
  return (
    <div
      className={cn(
        'relative rounded-xl border bg-white/[0.04] transition-colors focus-within:border-azure/60 focus-within:bg-white/[0.07] hover:bg-white/[0.06]',
        value ? 'border-azure/35' : 'border-white/10',
      )}
    >
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full appearance-none truncate rounded-xl bg-transparent pb-2 pl-3.5 pr-9 pt-6 text-sm text-white focus:outline-none [&>option]:bg-night"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
    </div>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [faixaPreco, setFaixaPreco] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (city) params.set('city', city);
    if (propertyType) params.set('tipo_apt', propertyType);
    if (status) params.set('status_imovel', status);
    if (faixaPreco) params.set('faixa_preco', faixaPreco);
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <form
      role="search"
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      {/* Campo principal: busca pelo nome do imóvel */}
      <BeamSearch
        value={search}
        onValueChange={setSearch}
        onSubmit={handleSearch}
        placeholder="Busque pelo nome do imóvel"
        shortcut
      />

      {/* Filtros + botão */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <FilterField
          label="Localização"
          value={city}
          onChange={setCity}
          options={[{ label: 'Qualquer cidade', value: '' }, ...cities]}
        />
        <FilterField label="Tipo" value={propertyType} onChange={setPropertyType} options={propertyTypes} />
        <FilterField label="Status" value={status} onChange={setStatus} options={statusOptions} />
        <FilterField label="Faixa de valor" value={faixaPreco} onChange={setFaixaPreco} options={priceRanges} />

        <button
          type="submit"
          className="btn-primary col-span-2 flex h-14 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold lg:col-span-1"
        >
          <Search className="h-4 w-4" />
          Buscar imóveis
        </button>
      </div>
    </form>
  );
}
