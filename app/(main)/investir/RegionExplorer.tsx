'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { REGIONS } from '@/app/lib/regions';

/** Abas das regiões acompanhadas: a escolhida revela a leitura de mercado e a posição na costa. */
export default function RegionExplorer() {
  const [active, setActive] = useState(2); // começa por Itapema
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const reduceMotion = useReducedMotion();
  const region = REGIONS[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + REGIONS.length) % REGIONS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div role="tablist" aria-label="Regiões acompanhadas" aria-orientation="vertical" onKeyDown={onKeyDown} className="lg:col-span-6">
        {REGIONS.map((r, i) => {
          const selected = i === active;
          return (
            <button
              key={r.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className="group flex w-full items-baseline gap-4 border-b border-white/10 py-4 text-left outline-none first:border-t focus-visible:bg-white/[0.04] sm:gap-6 sm:py-5"
            >
              <span className={`font-mono text-[11px] tracking-[0.2em] transition-colors ${selected ? 'text-accent' : 'text-white/35'}`}>
                0{i + 1}
              </span>
              <span
                className={`font-display text-3xl font-medium leading-none tracking-[-0.04em] transition-colors duration-300 sm:text-5xl ${
                  selected ? 'text-white' : 'text-white/30 group-hover:text-white/70'
                }`}
              >
                {r.name}
              </span>
              <span
                className={`ml-auto hidden h-2 w-2 shrink-0 self-center rounded-full transition-all sm:block ${
                  selected ? 'bg-accent shadow-[0_0_10px_#ff751f]' : 'bg-white/15'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="relative lg:col-span-5 lg:col-start-8 lg:self-center"
      >
        {/* Posição na costa, de norte a sul */}
        <div aria-hidden className="relative mb-8 h-10">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-azure/10 via-azure/40 to-azure/10" />
          {REGIONS.map((r, i) => (
            <span
              key={r.name}
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${
                i === active ? 'scale-150 border-accent bg-accent shadow-[0_0_12px_#ff751f]' : 'border-azure/50 bg-night'
              }`}
              style={{ left: `${8 + i * 28}%` }}
            />
          ))}
          <span className="absolute -bottom-3 left-0 font-mono text-[9px] tracking-[0.2em] text-white/35">N</span>
          <span className="absolute -bottom-3 right-0 font-mono text-[9px] tracking-[0.2em] text-white/35">S</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-azure">{region.coords}</p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">{region.name}</h3>
            <p className="mt-4 text-base leading-relaxed text-white/70">{region.market}</p>
            <Link
              href={region.href}
              className="group mt-7 inline-flex items-center gap-2 border-b border-azure/40 pb-1 text-sm text-azure transition-colors hover:border-azure hover:text-white"
            >
              Ver imóveis em {region.name}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
