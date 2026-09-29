// Skeleton do artigo de blog — espelha app/(main)/blog/[slug]/page.tsx
// (artigo: voltar, categoria, título, data, capa, conteúdo; sidebar: recentes + CTA).
export default function Loading() {
  return (
    <div className="bg-night min-h-screen pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-pulse">
          {/* Artigo */}
          <article className="lg:col-span-2">
            <div className="h-4 w-28 bg-white/10 rounded mb-6" />
            <div className="h-5 w-20 bg-white/10 rounded mb-4" />
            <div className="h-9 w-11/12 bg-white/10 rounded mb-3" />
            <div className="h-9 w-2/3 bg-white/10 rounded mb-4" />
            <div className="h-4 w-40 bg-white/10 rounded mb-6" />
            <div className="relative aspect-video rounded-xl bg-white/10 mb-8" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-3 bg-white/10 rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="h-5 w-36 bg-white/10 rounded mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-12 flex-shrink-0 rounded bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl h-40 bg-white/10" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
