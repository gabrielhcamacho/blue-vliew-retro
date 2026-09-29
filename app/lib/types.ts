export interface Property {
  id: string;
  property_code?: string;
  title: string;
  description?: string;
  status: string;
  property_type: string;
  purpose: string;
  property_situation?: string;
  price: number | null;
  rental_price: number | null;
  daily_price: number | null;
  iptu: number | null;
  condominium: number | null;
  address: string;
  address_number?: string | null;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number | null;
  longitude?: number | null;
  exact_location?: boolean;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spots: number;
  area_total: number | null;
  area_private: number | null;
  images: string[];
  accepts_barter?: boolean;
  barter_description?: string;
  cleaning_fee?: number;
  service_fee?: number;
  unit_features?: string[];
  building_features?: string[];
  created_at: string;
  updated_at: string;
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  contact?: {
    name: string;
    phone: string;
    email: string | null;
    avatar_url: string;
    company_name: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string;
  cover_image?: string | null;
  category: string;
  seo_title?: string | null;
  seo_description?: string | null;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse {
  success: boolean;
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface Branch {
  label: string;
  address: string;
}

export interface SiteConfig {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  /** Unidades de atendimento — exibidas no footer e na página de contato. */
  branches: Branch[];
  creci: string;
  hero_title: string;
  hero_subtitle: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
  hero_images: string[];
}

export interface PropertyFilters {
  purpose?: string;
  property_type?: string;
  city?: string;
  bedrooms?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
  page?: string;
  limit?: string;
  // Blueview-specific filters (client-side)
  tipologia?: string;      // e.g. "1s", "1s2d", "2s"
  metragem?: string;       // e.g. "ate50", "50_100", "acima300"
  tipo_apt?: string;       // e.g. "flat", "duplex", "cobertura", "garden"
  status_imovel?: string;  // e.g. "lancamento", "construcao", "pronto"
  regiao?: string;         // e.g. "frente_mar", "quadra_mar"
  faixa_preco?: string;    // e.g. "ate500", "500_1000", "acima10000"
  sort?: string;
}
