import type { Metadata } from 'next';
import { fetchBlogPosts } from '@/app/lib/rehut-api';
import BlogCard from '@/app/components/BlogCard';
import { BrandCurve } from '@/components/ui/brand-curve';
import { LineReveal } from '@/components/ui/line-reveal';

export const metadata: Metadata = {
  title: 'Blog | Blueview Imóveis',
  description: 'Conteúdo sobre o mercado imobiliário de Itapema e região. Tendências, análises e oportunidades exclusivas.',
};

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page = '1', category } = await searchParams;

  const data = await fetchBlogPosts({
    page: parseInt(page, 10),
    limit: 10,
    category,
  });

  const { data: posts, pagination } = data;
  const featured = posts[0];
  // Grade editorial: os dois primeiros maiores, o restante em três colunas
  const lead = posts.slice(1, 3);
  const rest = posts.slice(3);
  // Se a última linha ficaria com um card só, ele vira um card deitado de largura total
  const lastWide = rest.length % 3 === 1 ? rest.pop() : undefined;

  function buildPageUrl(p: number) {
    const q = new URLSearchParams();
    q.set('page', String(p));
    if (category) q.set('category', category);
    return `/blog?${q.toString()}`;
  }

  return (
    <div className="overflow-x-clip bg-night min-h-screen pb-16">
      {/* ── Abertura editorial ── */}
      <header className="relative isolate px-4 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <BrandCurve
          onMount
          delay={0.4}
          show="wave"
          strokeWidth={1}
          className="absolute right-[-30%] top-14 -z-10 h-20 w-[120%] opacity-40 md:right-[-8%] md:top-16 md:h-48 md:w-[70%] md:opacity-50"
        />
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-azure">[ Insights ] Blueview</p>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(2.4rem,5.2vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.05em] text-white lg:col-span-9">
              <LineReveal
                onMount
                delay={0.1}
                lines={[
                  'Inteligência para',
                  <span key="l2">
                    enxergar <span className="text-azure">além do imóvel.</span>
                  </span>,
                ]}
              />
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/60 sm:text-base lg:col-span-3 lg:pb-2">
              Análises sobre as regiões, os lançamentos e o mercado imobiliário do litoral catarinense.
            </p>
          </div>

          {/* Régua de assuntos */}
          <div aria-hidden className="mt-10 flex items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {['Regiões', 'Lançamentos', 'Mercado', 'Patrimônio'].map((t, i) => (
              <span key={t} className={`flex items-center gap-2 ${i > 1 ? 'hidden sm:flex' : ''}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-accent' : 'bg-azure/50'}`} />
                {t}
              </span>
            ))}
            <span className="ml-auto">{pagination.total > 0 && `${pagination.total} artigo${pagination.total !== 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12">
        {posts.length === 0 ? (
          <div className="border-y border-white/10 py-20 text-center">
            <p className="text-white/45 text-lg">Em breve, conteúdo exclusivo sobre o mercado imobiliário de Itapema e região.</p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="border-b border-white/10 pb-14 md:pb-16">
                <BlogCard post={featured} featured />
              </div>
            )}

            {lead.length > 0 && (
              <>
                <p className="mb-6 mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Mais leituras</p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {lead.map((post) => (
                    <BlogCard key={post.id} post={post} large />
                  ))}
                </div>
              </>
            )}

            {rest.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {lastWide && (
              <div className="mt-6">
                <BlogCard post={lastWide} wide />
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                {pagination.has_prev && (
                  <a href={buildPageUrl(parseInt(page) - 1)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-white/80 hover:bg-white/10">
                    ← Anterior
                  </a>
                )}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - parseInt(page)) <= 2)
                  .map((p) => (
                    <a
                      key={p}
                      href={buildPageUrl(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        p === parseInt(page) ? 'text-white' : 'border border-border text-white/80 hover:bg-white/10'
                      }`}
                      style={p === parseInt(page) ? { backgroundColor: '#ff751f' } : {}}
                    >
                      {p}
                    </a>
                  ))}
                {pagination.has_next && (
                  <a href={buildPageUrl(parseInt(page) + 1)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-white/80 hover:bg-white/10">
                    Próxima →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
