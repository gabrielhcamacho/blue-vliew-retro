'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'blueview_favorites';

function readStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  // Só vira true depois de ler o localStorage: evita mostrar "nenhum favorito" antes da hora.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(readStorage());
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite, ready };
}
