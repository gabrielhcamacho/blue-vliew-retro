/**
 * Regiões onde a Blueview atua, usadas pelas páginas Sobre e Investir. As coordenadas são as
 * do centro de cada praia/cidade (arredondadas ao minuto) e as descrições são qualitativas:
 * nenhum número de mercado aqui.
 */
export interface Region {
  name: string;
  /** Latitude e longitude para exibição. */
  coords: string;
  /** Leitura curta da região (Sobre). */
  short: string;
  /** Leitura de mercado, também qualitativa (Investir). */
  market: string;
  /** Posição no mapa esquemático do litoral (viewBox 400x480, norte para cima). */
  map: { x: number; y: number };
  /** Busca de imóveis da região (o filtro "search" cobre cidade e bairro). */
  href: string;
}

export const REGIONS: Region[] = [
  {
    name: 'Praia Brava',
    coords: '26°56′S 48°38′W',
    short: 'Mar aberto entre Balneário Camboriú e Itajaí, com projetos residenciais de perfil mais reservado.',
    market:
      'Vizinha de Balneário Camboriú, com orla menos adensada e empreendimentos de perfil mais reservado. Localização e vista pesam muito na escolha da unidade.',
    map: { x: 214, y: 70 },
    href: '/imoveis?search=Praia%20Brava',
  },
  {
    name: 'Balneário Camboriú',
    coords: '26°59′S 48°38′W',
    short: 'O skyline mais conhecido do litoral catarinense, com vida urbana inteira à beira-mar.',
    market:
      'Mercado consolidado e de alta densidade, com torres à beira-mar e forte presença de construtoras reconhecidas. Aqui a leitura é de endereço, andar e posição da unidade.',
    map: { x: 196, y: 150 },
    href: '/imoveis?search=Balne%C3%A1rio%20Cambori%C3%BA',
  },
  {
    name: 'Itapema',
    coords: '27°05′S 48°36′W',
    short: 'Meia Praia e a orla central reúnem boa parte dos lançamentos de alto padrão da região.',
    market:
      'Concentra muitos dos lançamentos de alto padrão da região, sobretudo em Meia Praia. Escolher construtora, fase da obra e momento de entrada faz diferença.',
    map: { x: 176, y: 292 },
    href: '/imoveis?search=Itapema',
  },
  {
    name: 'Porto Belo',
    coords: '27°09′S 48°33′W',
    short: 'Enseada de águas calmas e ritmo mais tranquilo, a poucos minutos de Itapema.',
    market:
      'Enseada calma e ritmo mais residencial, ao lado de Itapema. Atrai quem busca o litoral com menos adensamento, e cada empreendimento pede leitura própria.',
    map: { x: 250, y: 392 },
    href: '/imoveis?search=Porto%20Belo',
  },
];
