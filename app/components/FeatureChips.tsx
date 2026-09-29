'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Waves, Building2, Rocket, BedDouble, Crown, Leaf } from 'lucide-react';

export interface FeatureChip {
  label: string;
  param: string;
  value: string;
  count?: number;
}

const CHIP_ICONS: Record<string, React.ElementType> = {
  frente_mar:       Waves,
  quadra_mar:       Building2,
  lancamento:       Rocket,
  pronto_mobiliado: BedDouble,
  cobertura:        Crown,
  garden:           Leaf,
};

interface Props {
  chips: FeatureChip[];
}

export default function FeatureChips({ chips }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const toggle = (param: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (params.get(param) === value) {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    params.delete('page');
    router.push(`/imoveis?${params.toString()}`);
  };

  if (!chips.length) return null;

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto py-1"
      style={{ scrollbarWidth: 'none' }}
    >
      {chips.map((chip) => {
        const Icon = CHIP_ICONS[chip.value] ?? Building2;
        const active = sp.get(chip.param) === chip.value;
        return (
          <button
            key={`${chip.param}_${chip.value}`}
            onClick={() => toggle(chip.param, chip.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all shrink-0 ${
              active
                ? 'bg-[#ff751f] border-[#ff751f] text-white shadow-sm'
                : 'bg-card border-border text-white/80 hover:border-[#ff751f] hover:text-[#ff751f]'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {chip.label}
            {chip.count !== undefined && chip.count > 0 && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  active ? 'bg-white/25 text-white' : 'bg-white/5 text-white/60'
                }`}
              >
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
