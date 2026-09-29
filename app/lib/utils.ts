import type { Property } from './types';

export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: number | null): string {
  if (!value) return '';
  if (value > 10000) return `${(value / 10000).toFixed(2)} ha`;
  return `${value} m²`;
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartamento: 'Apartamento',
    casa: 'Casa',
    cobertura: 'Cobertura',
    terreno: 'Terreno',
    chacara: 'Chácara',
    flat: 'Flat',
    sala_comercial: 'Sala Comercial',
    loja: 'Loja',
    galpao: 'Galpão',
  };
  return labels[type] || type;
}

export function purposeLabel(purpose: string): string {
  const labels: Record<string, string> = {
    venda: 'Venda',
    aluguel: 'Aluguel',
    aluguel_temporada: 'Temporada',
    compra: 'Compra',
  };
  return labels[purpose] || purpose;
}

// Qualquer imagem remota (S3, Supabase, BunnyCDN, CloudFront, ou o que o
// CRM usar) já vem pronta e a URL muda a cada re-sincronização de foto —
// passar pelo otimizador do next/image só gasta a cota de "Image
// Optimization" do Vercel à toa. Só imagens locais (/public) seguem
// otimizadas normalmente.
export const isExternalImage = (src?: string | null): boolean =>
  !!src && /^https?:\/\//.test(src);

export function whatsappUrl(number: string, message = ''): string {
  const digits = number.replace(/\D/g, '');
  // Garante o código do país (Brasil = 55). Números com DDD + telefone têm 10 ou 11 dígitos;
  // com o código do país já embutido têm 12 ou 13. Sem o 55, o wa.me trata o DDD como país
  // estrangeiro e abre uma aba de "número inválido" em vez do chat.
  const clean = digits.length <= 11 ? `55${digits}` : digits;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}${message ? `?text=${encoded}` : ''}`;
}

export function propertyWhatsAppMessage(property: Property, whatsapp: string): string {
  const message = `Olá! Tenho interesse no imóvel "${property.title}" (${property.id}). Poderia me dar mais informações?`;
  return whatsappUrl(whatsapp, message);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Minúsculas e sem acentos, para comparar rótulos vindos da API.
 *
 * A situação do imóvel chega sem acento (`lancamento`, `construcao`), mas o texto digitado no
 * CRM pode vir acentuado. Comparar sem normalizar perde um dos dois lados.
 */
export function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Situação do imóvel — é este o campo que diz "lançamento", e não `status`.
 *
 * `status` guarda o ciclo de vida do anúncio (`active`/`inactive`/`sold`), então comparar
 * `status === 'lancamento'` nunca dá verdadeiro. Era esse o motivo de a seção de lançamentos
 * da home e o contador do chip aparecerem sempre zerados.
 */
export function isLancamento(property: Pick<Property, 'property_situation'>): boolean {
  const situation = normalizeText(property.property_situation);
  return situation.includes('lancamento') || situation.includes('planta');
}

export function getUniqueValues<T>(arr: T[], key: keyof T): string[] {
  const values = arr.map((item) => String(item[key])).filter(Boolean);
  return [...new Set(values)].sort();
}
