'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, CornerDownLeft, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isExternalImage } from '@/app/lib/utils';
import type { PropertySuggestion } from '@/app/api/imoveis/sugestoes/route';

/* ---------------- Feixe de luz ---------------- */

/** Brilho do feixe: halo desfocado salmão, azure e índigo sobre uma linha de 1px. */
function BeamGlow() {
  return (
    <>
      <div
        className="absolute inset-x-2 bottom-0 h-8 blur-md"
        style={{
          background:
            'radial-gradient(50% 55% at 50% 100%, rgba(255,117,31,0.9), rgba(118,211,246,0.55) 40%, rgba(31,79,209,0.35) 70%, transparent)',
        }}
      />
      <div
        className="absolute inset-x-10 bottom-0 h-2.5 blur-[3px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 100%, rgba(255,160,110,0.9), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, #1f4fd1 18%, #76d3f6 38%, #ff751f 50%, #76d3f6 62%, #1f4fd1 82%, transparent)',
        }}
      />
    </>
  );
}

/* ---------------- Catálogo para o autocomplete ---------------- */

// Um único download por visita, compartilhado por todas as barras de busca da página.
let catalogPromise: Promise<PropertySuggestion[]> | null = null;

function loadCatalog() {
  catalogPromise ??= fetch('/api/imoveis/sugestoes')
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      catalogPromise = null; // deixa tentar de novo no próximo foco
      return [];
    });
  return catalogPromise;
}

/** Minúsculas e sem acento, para "itapema" achar "Itapéma" e "sao" achar "São". */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const MAX_RESULTS = 6;

function rankSuggestions(catalog: PropertySuggestion[], query: string) {
  const q = normalize(query);
  if (!q) return catalog.slice(0, MAX_RESULTS);
  const terms = q.split(/\s+/);

  const scored: { item: PropertySuggestion; score: number }[] = [];
  for (const item of catalog) {
    const title = normalize(item.title);
    const haystack = `${title} ${normalize(item.neighborhood ?? '')} ${normalize(item.city ?? '')} ${normalize(item.code ?? '')}`;
    if (!terms.every((t) => haystack.includes(t))) continue;
    // Nome começando pelo que foi digitado vem primeiro, depois uma palavra do nome, depois o resto.
    const score = title.startsWith(q) ? 0 : title.split(/\s+/).some((w) => w.startsWith(terms[0])) ? 1 : title.includes(q) ? 2 : 3;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title, 'pt-BR'))
    .slice(0, MAX_RESULTS)
    .map((s) => s.item);
}

/** Destaca em azure o trecho do nome que bate com a busca (ignorando acentos). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = normalize(query);
  const i = q ? normalize(text).indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-azure">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);
const noopSubscribe = () => () => {};

/* ---------------- BeamSearch ---------------- */

interface BeamSearchProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Busca pelo texto digitado (Enter ou "Buscar por ..."). */
  onSubmit: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  size?: 'sm' | 'lg';
  /** Liga o atalho ⌘K / Ctrl K para focar a busca. */
  shortcut?: boolean;
  className?: string;
}

/**
 * Busca de imóveis: um feixe de luz (índigo → azure → salmão) percorre a borda de baixo
 * acompanhando o cursor enquanto se digita, e um painel sugere imóveis pelo nome.
 */
export function BeamSearch({
  value,
  onValueChange,
  onSubmit,
  onBlur,
  placeholder = 'Buscar imóveis pelo nome',
  size = 'lg',
  shortcut = false,
  className,
}: BeamSearchProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Blur causado pela própria escolha (sugestão ou Enter) não deve disparar o onBlur de quem usa.
  const leavingRef = useRef(false);
  const listId = useId();

  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);
  const [catalog, setCatalog] = useState<PropertySuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const mac = useSyncExternalStore(noopSubscribe, isMac, () => true);

  // Posição horizontal do feixe (px dentro da barra), com mola para deslizar suave.
  const beamX = useSpring(0, { stiffness: 260, damping: 28, mass: 0.6 });
  const reduceMotion = useReducedMotion();

  const results = useMemo(() => rankSuggestions(catalog, value), [catalog, value]);
  const query = value.trim();
  // Última linha do painel: "Buscar por ...", só quando há texto.
  const optionCount = results.length + (query ? 1 : 0);
  const open = focused && (results.length > 0 || !!query);

  /** Leva o feixe até o cursor de texto, medindo o texto antes dele num espelho invisível. */
  const syncBeam = useCallback(() => {
    const input = inputRef.current;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;
    mirror.textContent = input.value.slice(0, input.selectionStart ?? input.value.length) || '';
    const x = input.offsetLeft + mirror.offsetWidth - input.scrollLeft;
    beamX.set(Math.min(Math.max(x, input.offsetLeft), input.offsetLeft + input.clientWidth));
  }, [beamX]);

  const pulse = () => {
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 700);
  };

  useEffect(() => () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
  }, []);

  // ⌘K / Ctrl K foca a busca de qualquer lugar da página.
  useEffect(() => {
    if (!shortcut) return;
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [shortcut]);

  const handleFocus = () => {
    setFocused(true);
    loadCatalog().then(setCatalog);
    requestAnimationFrame(syncBeam);
  };

  const goTo = (item: PropertySuggestion) => {
    leavingRef.current = true;
    inputRef.current?.blur();
    router.push(`/imoveis/${item.id}`);
  };

  const submit = () => {
    leavingRef.current = true;
    inputRef.current?.blur();
    onSubmit(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && optionCount) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % optionCount);
    } else if (e.key === 'ArrowUp' && optionCount) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? optionCount - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) goTo(results[activeIndex]);
      else submit();
    } else if (e.key === 'Escape') {
      if (value) onValueChange('');
      else inputRef.current?.blur();
    }
  };

  const isLg = size === 'lg';
  const textClass = isLg ? 'text-base' : 'text-sm';

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'group/search relative flex items-center overflow-hidden rounded-xl border bg-night/70 backdrop-blur-md transition-colors duration-300',
          focused ? 'border-white/25' : 'border-white/12 hover:border-white/20',
          isLg ? 'h-14 gap-3 px-5' : 'h-9 gap-2 px-3',
        )}
      >
        <Search
          className={cn(
            'shrink-0 transition-colors',
            focused ? 'text-white/80' : 'text-white/45',
            isLg ? 'h-[18px] w-[18px]' : 'h-4 w-4',
          )}
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          aria-label={placeholder}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onValueChange(e.target.value);
            setActiveIndex(-1);
            pulse();
            requestAnimationFrame(syncBeam);
          }}
          onKeyDown={onKeyDown}
          onKeyUp={syncBeam}
          onClick={syncBeam}
          onSelect={syncBeam}
          onFocus={handleFocus}
          onBlur={() => {
            setFocused(false);
            setActiveIndex(-1);
            if (!leavingRef.current) onBlur?.();
            leavingRef.current = false;
          }}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-white caret-azure placeholder:text-white/40 focus:outline-none',
            textClass,
          )}
        />
        {/* Espelho invisível com a mesma fonte do input, usado para medir onde está o cursor */}
        <span
          ref={mirrorRef}
          aria-hidden
          className={cn('pointer-events-none invisible absolute left-0 top-0 whitespace-pre', textClass)}
        />

        {value ? (
          <button
            type="button"
            aria-label="Limpar busca"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onValueChange('');
              inputRef.current?.focus();
              requestAnimationFrame(syncBeam);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          shortcut && (
            <kbd className="hidden shrink-0 rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50 sm:inline-block">
              {mac ? '⌘K' : 'Ctrl K'}
            </kbd>
          )
        )}

        {/* Feixe na borda de baixo: percorre a barra sozinho o tempo todo e,
            enquanto se digita, salta para o cursor de texto e acende mais forte */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-full w-40 -translate-x-1/2"
          initial={{ left: '8%', opacity: 0 }}
          animate={{
            left: reduceMotion ? '50%' : ['8%', '92%'],
            opacity: typing ? 0 : focused ? 1 : 0.85,
          }}
          transition={{
            left: reduceMotion
              ? { duration: 0 }
              : { duration: isLg ? 4.5 : 3.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
            opacity: { duration: 0.35, ease: 'easeOut' },
          }}
        >
          <BeamGlow />
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-full w-40 -translate-x-1/2"
          style={{ x: beamX }}
          initial={false}
          animate={{ opacity: typing ? 1 : 0, scaleX: typing ? 1.15 : 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <BeamGlow />
        </motion.div>
      </div>

      {/* Sugestões */}
      <div
        id={listId}
        role="listbox"
        aria-label="Sugestões de imóveis"
        onMouseDown={(e) => e.preventDefault()}
        className={cn(
          'absolute left-0 top-full z-50 mt-2 w-full min-w-[18rem] origin-top overflow-hidden rounded-xl border border-border shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200',
          open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-1 scale-[0.98] opacity-0',
        )}
        style={{ backgroundColor: 'rgba(8,3,72,0.96)' }}
      >
        <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-azure/80">
          {query ? '[ Imóveis ]' : '[ Sugestões ]'}
        </p>

        {query && results.length === 0 && (
          <p className="px-4 py-2 text-sm text-white/50">Nenhum imóvel com esse nome</p>
        )}

        <ul className="max-h-80 overflow-y-auto pb-1">
          {results.map((item, i) => {
            const active = i === activeIndex;
            const place = [item.neighborhood, item.city].filter(Boolean).join(', ');
            return (
              <li
                key={item.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => goTo(item)}
                className={cn(
                  'relative flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors',
                  active ? 'bg-white/[0.06]' : '',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-azure to-accent transition-opacity',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white/5">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="36px"
                      unoptimized={isExternalImage(item.image)}
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-white">
                    <Highlight text={item.title} query={query} />
                  </span>
                  {place && <span className="block truncate text-xs text-white/45">{place}</span>}
                </span>
                <ArrowUpRight
                  className={cn(
                    'h-4 w-4 shrink-0 text-accent transition-all',
                    active ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
                  )}
                />
              </li>
            );
          })}

          {query && (
            <li
              id={`${listId}-${results.length}`}
              role="option"
              aria-selected={activeIndex === results.length}
              onMouseEnter={() => setActiveIndex(results.length)}
              onClick={submit}
              className={cn(
                'mt-1 flex cursor-pointer items-center gap-3 border-t border-border px-4 py-2.5 text-sm text-white/70 transition-colors',
                activeIndex === results.length ? 'bg-white/[0.06] text-white' : '',
              )}
            >
              <Search className="h-4 w-4 shrink-0 text-azure" />
              <span className="min-w-0 flex-1 truncate">
                Buscar por <span className="text-white">“{query}”</span>
              </span>
              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-white/40" />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
