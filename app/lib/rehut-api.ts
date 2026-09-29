import type {
  PropertiesResponse,
  Property,
  BlogPost,
  BlogResponse,
  SiteConfig,
  PropertyFilters,
} from './types';

const BASE_URL = process.env.REHUT_API_BASE_URL!;
const TOKEN = process.env.REHUT_API_TOKEN!;

// Enquanto as credenciais reais da Blueview não forem configuradas no .env.local
// (valores placeholder), o site sobe normalmente com listagens vazias em vez de quebrar.
const API_CONFIGURED = /^https?:\/\//.test(BASE_URL ?? '') && Boolean(TOKEN);

function emptyProperties(): PropertiesResponse {
  return {
    success: false,
    data: [],
    pagination: { page: 1, limit: 0, total: 0, total_pages: 0, has_next: false, has_prev: false },
  };
}

function buildUrl(endpoint: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set('token', TOKEN);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertiesResponse> {
  if (!API_CONFIGURED) return emptyProperties();
  const url = buildUrl('public-properties-api', {
    purpose: filters.purpose,
    property_type: filters.property_type,
    city: filters.city,
    bedrooms: filters.bedrooms,
    search: filters.search,
    page: filters.page || '1',
    limit: filters.limit || '20',
  });

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
  return res.json();
}

/**
 * Campos que a listagem realmente usa (cards + filtros + ordenação de /imoveis e /favoritos).
 *
 * Sem projeção a API devolve 47 campos por imóvel, incluindo `description`, de longe o mais
 * pesado. Com esta lista cada página fica bem abaixo do teto de 2 MB do cache de `fetch` do
 * Next — sem isso nada é cacheado e toda visita rebusca o catálogo inteiro.
 */
const LIST_FIELDS = [
  'id', 'property_code', 'title', 'property_type', 'purpose', 'property_situation',
  'price', 'rental_price', 'address', 'neighborhood', 'city',
  'bedrooms', 'suites', 'parking_spots', 'area_total', 'area_private',
  'images', 'status', 'created_at',
].join(',');

/** Teto do `?limit=` da API. */
const LIST_PAGE_SIZE = 500;
/** Trava de segurança: impede laço infinito se `has_next` vier errado. */
const MAX_LIST_PAGES = 40;

/**
 * Baixa o catálogo inteiro, percorrendo as páginas da API.
 *
 * Antes esta função fazia UMA chamada com `limit=300` e tratava o resultado como o catálogo
 * completo. Hoje esta loja cabe folgada nesse tamanho, mas bastaria crescer — ou ligar o DWV
 * no token — para o site passar a esconder o excedente sem dar nenhum sinal.
 */
export async function fetchAllProperties(filters: PropertyFilters = {}): Promise<PropertiesResponse> {
  if (!API_CONFIGURED) return emptyProperties();

  const pageUrl = (page: number) =>
    buildUrl('public-properties-api', {
      purpose: filters.purpose,
      property_type: filters.property_type,
      city: filters.city,
      fields: LIST_FIELDS,
      page,
      limit: LIST_PAGE_SIZE,
    });

  const getPage = async (page: number): Promise<PropertiesResponse> => {
    const res = await fetch(pageUrl(page), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
    return res.json();
  };

  const first = await getPage(1);
  const data: Property[] = [...(first.data ?? [])];

  // A primeira resposta já diz quantas páginas existem, então as demais vão em paralelo.
  const totalPages = Math.min(first.pagination?.total_pages ?? 1, MAX_LIST_PAGES);
  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => getPage(i + 2))
    );
    for (const chunk of rest) data.push(...(chunk.data ?? []));
  }

  return {
    success: first.success,
    data,
    pagination: {
      page: 1,
      limit: data.length,
      total: first.pagination?.total ?? data.length,
      total_pages: 1,
      has_next: false,
      has_prev: false,
    },
  };
}

export async function fetchPropertyById(id: string): Promise<PropertiesResponse> {
  if (!API_CONFIGURED) return emptyProperties();
  // Usa o endpoint de detalhe (?id=), que é rápido e leve (~9KB) e traz todas as imagens,
  // em vez de baixar o catálogo inteiro e filtrar no cliente.
  const url = buildUrl('public-properties-api', { id });
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch property: ${res.status}`);
  const json = await res.json();
  const item = json?.success ? json.data : null;
  const count = item ? 1 : 0;
  return {
    success: !!item,
    data: item ? [item] : [],
    pagination: { page: 1, limit: 1, total: count, total_pages: count, has_next: false, has_prev: false },
    contact: json?.contact,
  } as PropertiesResponse;
}

export async function fetchBlogPosts(params: {
  page?: number;
  limit?: number;
  category?: string;
} = {}): Promise<BlogResponse> {
  if (!API_CONFIGURED) {
    return {
      success: false,
      data: [],
      pagination: { page: 1, limit: 0, total: 0, total_pages: 0, has_next: false, has_prev: false },
    };
  }
  const url = buildUrl('public-blog-api', {
    page: params.page || 1,
    limit: params.limit || 10,
    category: params.category,
  });

  const res = await fetch(url, { next: { revalidate: 120, tags: ['blog'] } });
  if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.status}`);
  return res.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (!API_CONFIGURED) return null;
  const url = buildUrl('public-blog-api', { slug });

  const res = await fetch(url, { next: { revalidate: 120, tags: ['blog', `blog-${slug}`] } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data : null;
}

// Conteúdo gerenciado no código (não no CRM) por solicitação do cliente.
// Contatos, filiais e redes sociais vêm do CRM; preencha aqui apenas se a Blueview
// quiser valores fixos que tenham precedência sobre ele.
const CONTENT_OVERRIDES = {
  hero_title: 'Viva com vista para o mar',
};

function withContentOverrides(cfg: SiteConfig): SiteConfig {
  return {
    ...cfg,
    hero_title: CONTENT_OVERRIDES.hero_title,
  };
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const defaults: SiteConfig = {
    whatsapp: '',
    phone: '',
    email: '',
    address: '',
    branches: [],
    creci: '',
    hero_title: CONTENT_OVERRIDES.hero_title,
    hero_subtitle: 'Imobiliária em Itapema e região',
    social_links: {},
    hero_images: [],
  };

  try {
    const url = buildUrl('public-website-config-api');
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return withContentOverrides(defaults);
    const data = await res.json();
    // A API às vezes retorna campos como string vazia em vez de omiti-los;
    // sem isso, "" sobrescreveria os valores padrão acima (ex: whatsapp).
    const cleaned = Object.fromEntries(
      Object.entries(data.data ?? {}).filter(([, value]) => value !== '' && value != null)
    );
    return withContentOverrides(data.success ? { ...defaults, ...cleaned } : defaults);
  } catch {
    return withContentOverrides(defaults);
  }
}
