/**
 * Organização dos dados da página de detalhe do imóvel.
 *
 * Tudo aqui só reagrupa o que a API já entrega: nenhuma característica é deduzida do texto
 * livre da descrição. Quando um campo não vem preenchido, a seção correspondente some.
 */
import type { FeatureBlock, Property } from './types';
import { normalizeText } from './utils';

type RawFeature = string | FeatureBlock;

export interface FeatureGroups {
  unit: string[];
  building: string[];
  security: string[];
}

/**
 * Tags que vão para "Segurança e conveniência". A lista usa só as tags que o CRM envia
 * (DWV em inglês, cadastro próprio em português), sem interpretar o título.
 */
const SECURITY_TAGS = new Set([
  'security_guardhouse',
  'intercom',
  'tv_circuit',
  'alarm',
  'password_lock_entrance_door',
  'eletronic_lock_for_front_door',
  'elevator',
  'internet',
  'bike_rack',
  'entrance_to_bathers_and_beach_box',
  'portaria_24h',
  'seguranca_24h',
  'sistema_alarme',
  'interfone',
  'fechadura_eletronica',
  'fechadura_senha',
  'circuito_tv',
  'gerador',
  'elevador',
]);

/** Rótulos das tags do cadastro próprio, que chegam só como identificador. */
const LEGACY_LABELS: Record<string, string> = {
  mobiliado: 'Mobiliado',
  pronto_morar: 'Pronto para morar',
  aceita_pets: 'Aceita pets',
  ar_condicionado: 'Ar-condicionado',
  closet: 'Closet',
  lavabo: 'Lavabo',
  lareira: 'Lareira',
  despensa: 'Despensa',
  armario_embutido: 'Armário embutido',
  moveis_planejados: 'Móveis planejados',
  moveis_planejados_completo: 'Móveis planejados completos',
  cozinha_americana: 'Cozinha americana',
  armario_cozinha: 'Armário de cozinha',
  churrasqueira_gas: 'Churrasqueira a gás',
  churrasqueira_carvao: 'Churrasqueira a carvão',
  banheira_privativa: 'Banheira privativa',
  hidromassagem_privativa: 'Hidromassagem privativa',
  piscina_privativa: 'Piscina privativa',
  area_servico: 'Área de serviço',
  elevador: 'Elevador',
  portaria_24h: 'Portaria 24h',
  seguranca_24h: 'Segurança 24h',
  sistema_alarme: 'Sistema de alarme',
  gerador: 'Gerador',
  interfone: 'Interfone',
  fechadura_eletronica: 'Fechadura eletrônica',
  fechadura_senha: 'Fechadura com senha',
  internet: 'Internet',
  circuito_tv: 'Circuito de TV',
  cortinas_automatizadas: 'Cortinas automatizadas',
  isolamento_acustico: 'Isolamento acústico',
  gas_individual: 'Gás individual',
  hidrometro_individual: 'Hidrômetro individual',
  infraestrutura_agua_quente: 'Infraestrutura para água quente',
  vista_mar: 'Vista para o mar',
  sol_manha: 'Sol da manhã',
  sol_tarde: 'Sol da tarde',
  porcelanato: 'Porcelanato',
};

// Alguns títulos do DWV chegam com caracteres invisíveis (ex.: U+2060) no começo.
const INVISIBLE = /[​-‍⁠﻿]/g;

function legacyLabel(tag: string) {
  if (LEGACY_LABELS[tag]) return LEGACY_LABELS[tag];
  const text = tag.replace(/_/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function groupFeatures(property: Pick<Property, 'unit_features' | 'building_features'>): FeatureGroups {
  const groups: FeatureGroups = { unit: [], building: [], security: [] };
  const seen = new Set<string>();

  const add = (group: keyof FeatureGroups, title: string, tag: string) => {
    const label = title.replace(INVISIBLE, '').trim();
    const key = normalizeText(label);
    if (!label || seen.has(key)) return;
    seen.add(key);
    groups[SECURITY_TAGS.has(tag) ? 'security' : group].push(label);
  };

  // As duas listas costumam repetir os mesmos blocos; `seen` evita itens duplicados.
  const raw = [...toArray(property.unit_features), ...toArray(property.building_features)];
  for (const item of raw) {
    if (typeof item === 'string') {
      add('unit', legacyLabel(item), item);
      continue;
    }
    const group = normalizeText(item.type) === 'empreendimento' ? 'building' : 'unit';
    const tags = item.tags ?? [];
    (item.titles ?? []).forEach((title, i) => add(group, title, tags[i] ?? ''));
  }
  return groups;
}

function toArray(value: unknown): RawFeature[] {
  return Array.isArray(value) ? (value as RawFeature[]) : [];
}

export interface DescriptionParts {
  /** Primeiro parágrafo, usado como introdução. */
  intro: string;
  /** Demais parágrafos, exatamente como vieram, para a descrição completa expansível. */
  rest: string[];
}

/**
 * Divide a descrição só pelos parágrafos que já existem no texto. Não resume, não reescreve
 * e não tenta classificar frases: o texto técnico continua com as palavras do cadastro.
 */
export function splitDescription(description?: string | null): DescriptionParts | null {
  const text = description?.replace(/\r\n/g, '\n').trim();
  if (!text) return null;
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [intro, ...rest] = paragraphs;
  return { intro, rest };
}

export type Stage = 'lancamento' | 'construcao' | 'pronto';

export const STAGES: { id: Stage; label: string }[] = [
  { id: 'lancamento', label: 'Lançamento' },
  { id: 'construcao', label: 'Em construção' },
  { id: 'pronto', label: 'Pronto para morar' },
];

/** Estágio da obra a partir de `property_situation`; `null` quando o valor não é reconhecido. */
export function propertyStage(situation?: string | null): Stage | null {
  const s = normalizeText(situation);
  if (!s) return null;
  if (s.includes('lancamento') || s.includes('planta')) return 'lancamento';
  if (s.includes('construc') || s.includes('obra')) return 'construcao';
  if (s.includes('pronto')) return 'pronto';
  return null;
}

/** Coordenada em graus e minutos (ex.: 26°57′S), a precisão de bairro que a página expõe. */
export function formatCoord(value: number, axis: 'lat' | 'lng') {
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  const hemi = axis === 'lat' ? (value < 0 ? 'S' : 'N') : value < 0 ? 'W' : 'E';
  return `${deg}°${String(min).padStart(2, '0')}′${hemi}`;
}
