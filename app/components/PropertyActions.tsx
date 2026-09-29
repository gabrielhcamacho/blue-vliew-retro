'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Check, Share2 } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  title: string;
}

const btn =
  'inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure';

/** Favoritar (mesma lista do resto do site) e compartilhar o imóvel. */
export default function PropertyActions({ id, title }: Props) {
  const { isFavorite, toggle, ready } = useFavorites();
  const [copied, setCopied] = useState(false);
  const saved = ready && isFavorite(id);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // Cancelar o compartilhamento não é erro; outras falhas caem na cópia do link.
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Copie o link do imóvel:', url);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggle(id)}
        aria-pressed={saved}
        className={cn(btn, saved ? 'border-accent/60 text-accent' : 'border-white/15 text-white/80 hover:border-azure hover:text-azure')}
      >
        <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        {saved ? 'Salvo' : 'Salvar'}
        <span className="sr-only"> nos favoritos</span>
      </button>
      <button type="button" onClick={share} className={cn(btn, 'border-white/15 text-white/80 hover:border-azure hover:text-azure')}>
        {copied ? <Check className="h-4 w-4 text-azure" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Link copiado' : 'Compartilhar'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link do imóvel copiado' : ''}
      </span>
    </div>
  );
}
