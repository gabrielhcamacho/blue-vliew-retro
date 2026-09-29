import { NextResponse } from 'next/server';
import { fetchAllProperties } from '@/app/lib/rehut-api';

/** Item enxuto que o autocomplete da busca precisa (nome, onde fica e uma foto). */
export interface PropertySuggestion {
  id: string;
  title: string;
  code?: string;
  neighborhood: string;
  city: string;
  type: string;
  image?: string;
}

/**
 * Catálogo resumido para o autocomplete das barras de busca. O navegador baixa uma vez e
 * filtra localmente a cada tecla, sem uma chamada ao Rehut por letra digitada.
 */
export async function GET() {
  try {
    const { data } = await fetchAllProperties();
    const suggestions: PropertySuggestion[] = (data ?? [])
      .filter((p) => p.title)
      .map((p) => ({
        id: p.id,
        title: p.title.trim(),
        code: p.property_code,
        neighborhood: p.neighborhood,
        city: p.city,
        type: p.property_type,
        image: p.images?.[0],
      }));

    return NextResponse.json(suggestions, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
