# Blueview Imóveis — status e pendências

Clone do `mercatto-itapema` (mesma estrutura, componentes e UX), com a identidade da Blueview.

## ✅ Feito
- Projeto copiado para `blue-view`, `package.json` → `blue-view`.
- **Cores:** Índigo Vívido `#0f0392` (primária — ícones, links, gradientes, destaques),
  Salmão `#ff751f` (botões/CTAs), Azure Pastel `#76d3f6` (reservada), Branco.
  Tons derivados: índigo escuro `#0a0270`/`#07014f`/`#05013a`, índigo claro `#ecebfa`,
  azul de gradiente `#1f4fd1`, salmão escuro `#e85f0c`, salmão claro `#fff0e6`.
- **Logo e favicon:** `public/logo-blueview.png` (recortada, fundo transparente) no header,
  footer e Sobre; `app/icon.png` + `app/apple-icon.png` gerados a partir do símbolo (sol + onda).
- **Hero:** `public/hero-1.jpg` e `public/hero-2.jpg` (fotos novas).
- **Textos:** marca Mercatto → Blueview em metadados, páginas e componentes. Removidos da Sobre
  a história "desde 2006" e a biografia da Cristiane Carvalho (específicas da Mercatto).
- Hero title: "Viva com vista para o mar" (`CONTENT_OVERRIDES` em `app/lib/rehut-api.ts`).
- Contatos, filiais e redes sociais agora vêm só do CRM (overrides da Mercatto removidos).

## ⏳ Pendências
1. **Token Rehut da Blueview** — `REHUT_API_TOKEN` no `.env.local` está vazio (site sobe com listagens vazias até ser preenchido).
2. **Contatos / endereço / redes sociais / CRECI** — cadastrar no CRM ou fixar em `CONTENT_OVERRIDES`.
3. **Domínio** — `metadataBase`, link do imóvel (`PropertyContactCard`) e webmail usam
   `blueviewimoveis.com.br` como provisório.
4. **Região** — textos ainda falam de Itapema e região (herdado); confirmar a região de atuação.
5. **Textos da Sobre / investir** — revisar com o texto institucional da Blueview.

> Ao trocar um asset mantendo o mesmo nome de arquivo, limpe o cache do otimizador de imagens
> (`rm -rf .next/dev/cache/images .next/cache/images`).
