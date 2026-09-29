# blue-view-retro

Site da **Blueview Imóveis** (Next.js). Clone do `mercatto-itapema` com identidade visual da Blueview.

```bash
npm install
npm run dev
```

Variáveis em `.env.local`: `REHUT_API_BASE_URL` e `REHUT_API_TOKEN` (token da imobiliária no Rehut).

## Versão retrofuturista (este projeto)

Segunda versão do site da Blueview, com o mesmo conteúdo e integração com o Rehut do `blue-view`, mas com outro design:

- **Hero** (`components/ui/prisma-hero.tsx`): vídeo `public/video-city.mp4` de fundo (comprimido, sem áudio, com `video-city-poster.jpg` de capa), granulado + scanlines e "Blueview" gigante com animação de palavras (framer-motion).
- **Rastro do mouse** (`components/ui/cursor-trail.tsx`): traço desfocado em degradê índigo → salmão, montado no layout raiz. Desligado em telas de toque e com `prefers-reduced-motion`.
- **Cards de imóvel** (`components/ui/card-14.tsx` + `app/components/PropertyCard.tsx`): card que gira em 3D no hover; no toque, o primeiro toque vira e o segundo abre o imóvel.
- **Site todo em tema escuro** (`bg-night`), com rótulos em fonte mono e títulos em Space Grotesk. Contato ainda abre com `app/components/PageHero.tsx` (grade synthwave, scanlines e título grande); Sobre, Investir, Blog e Favoritos têm aberturas próprias.
- **Header** sempre em vidro escuro; os links usam a classe `.nav-roll` (em `globals.css`): o texto rola para uma cópia em azure e uma linha azure → salmão cresce do centro. Na home ele só aparece depois de passar o hero.
- **Footer** com "BLUEVIEW" gigante em contorno (`components/ui/text-hover-effect.tsx`): o traço se desenha ao aparecer e, sob o cursor, ganha degradê salmão → índigo → azure.
- **Busca de imóveis** (`components/ui/beam-search.tsx`), usada na home e na barra de filtros de /imoveis: um feixe índigo, azure e salmão corre pela borda de baixo acompanhando o cursor enquanto se digita, com atalho ⌘K. O autocomplete sugere imóveis pelo nome (sem diferenciar acentos) a partir de `/api/imoveis/sugestoes`, que devolve o catálogo resumido, baixado uma vez por visita.
- **Busca da home** (`app/components/SearchBar.tsx`): sem painel em volta; o campo de nome vem primeiro e maior, e os filtros (cada um com superfície própria e rótulo em mono) ficam numa linha com o botão laranja.
- **Grafismo da marca** reaproveitado nas páginas internas: `components/ui/brand-curve.tsx` (arco e onda da logomarca desenhados uma vez), `components/ui/sea-horizon.tsx` (horizonte com brilho e reflexos), `components/ui/line-reveal.tsx` (títulos revelados por linha) e `components/ui/coast-map.tsx` (costa abstrata com as regiões). As regiões ficam em `app/lib/regions.ts`.
- **Sobre**: abertura livre com horizonte e arco da marca, manifesto, faixa das quatro regiões com coordenadas, método em quatro etapas, princípios tipográficos e encerramento com CTA.
- **Investir**: hero com o mapa da costa, bloco assimétrico de diferenciais, explorador de regiões (`app/(main)/investir/RegionExplorer.tsx`, tabs acessíveis por teclado), processo de curadoria em seis etapas, lançamentos reais e formulário.
- **Blog**: abertura editorial, matéria principal em destaque e cards com imagem maior, categoria, resumo cortado e linha colorida no hover.
- **Favoritos**: cabeçalho compacto com marcador sob a curva da marca; estado vazio com espaços no formato dos cards e skeleton enquanto lê o que ficou salvo no navegador (`useFavorites` agora devolve `ready`).
- **Página do imóvel** (`app/(main)/imoveis/[id]/page.tsx`): cabeçalho com tags, título, bairro, favoritar e compartilhar; galeria em mosaico (`app/components/PropertyGallery.tsx`) com tela cheia, miniaturas, contador e teclado. A capa é a primeira foto horizontal, lida do cabeçalho do arquivo por `app/lib/image-size.ts`, e as fotos verticais aparecem inteiras. Depois vêm a faixa de números, as seções montadas por `app/lib/property-details.ts` (só aparecem com dado), um painel de contato fixo no desktop e uma barra no mobile (`PropertyContactCard.tsx`) que registra o lead e abre o WhatsApp com nome, código e link. A seção Localização tem o mesmo mapa do Rehut (`app/components/PropertyMap.tsx`): MapLibre com o estilo Positron da Carto, que não pede chave de API, e um alfinete na latitude/longitude do cadastro que abre um popup com título e endereço. A biblioteca só carrega quando o mapa chega perto da tela.
- Animações respeitam `prefers-reduced-motion` (feixe da busca, curvas da marca, horizonte, títulos e `AnimatedSection`); tudo anima uma vez só.
- Estrutura shadcn: `components/ui/`, `lib/utils.ts` (`cn`) e `components.json`.
# blue-vliew-retro
