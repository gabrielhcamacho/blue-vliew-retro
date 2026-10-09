/**
 * Locais oferecidos nos filtros de localização (barra de filtros e busca da home).
 * Cada cidade traz os bairros que a Blueview considera úteis para selecionar.
 * Um bairro só faz sentido dentro da cidade: "Centro" existe em Balneário Camboriú e em Itajaí.
 */
export interface CityLocation {
  city: string;
  bairros: string[];
}

export const LOCATIONS: CityLocation[] = [
  {
    city: 'Balneário Camboriú',
    bairros: ['Estaleiro', 'Centro', 'Barra Sul', 'Pioneiros | Barra Norte', 'Praia dos Amores'],
  },
  {
    city: 'Itajaí',
    bairros: ['Dom Bosco', 'São João', 'São Judas', 'Praia Brava', 'Fazenda', 'Fazendinha', 'Centro', 'Cabeçudas'],
  },
  { city: 'Porto Belo', bairros: [] },
];

const strip = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/**
 * Compara o bairro escolhido com o do CRM, sem acento e por palavra inteira
 * ("Fazenda" não pega "Fazendinha"). "Pioneiros | Barra Norte" vale para qualquer um dos dois.
 */
export function matchesBairro(neighborhood: string | null | undefined, bairro: string): boolean {
  const hay = strip(neighborhood ?? '');
  if (!hay) return false;
  return bairro
    .split('|')
    .map(strip)
    .filter(Boolean)
    .some((part) => new RegExp(`(^|[^a-z0-9])${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(hay));
}
