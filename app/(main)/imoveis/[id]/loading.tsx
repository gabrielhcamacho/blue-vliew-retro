// Skeleton da página de detalhe do imóvel — espelha app/(main)/imoveis/[id]/page.tsx
// (cabeçalho, mosaico de fotos, faixa de números, seções de texto e painel de contato).
export default function Loading() {
  return (
    <div className="min-h-screen bg-night pt-20">
      <div className="mx-auto max-w-7xl animate-pulse px-4 pb-16 pt-6 motion-reduce:animate-none sm:px-6 lg:px-8 lg:pt-8">
        <div className="h-4 w-40 rounded bg-white/10" />

        {/* Cabeçalho */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-3xl space-y-3">
            <div className="h-3 w-44 rounded bg-white/10" />
            <div className="h-10 w-5/6 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-24 rounded-full bg-white/10" />
            <div className="h-11 w-36 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Galeria */}
        <div className="mt-6 aspect-[4/3] rounded-xl bg-white/10 sm:aspect-video lg:mt-8 lg:grid lg:aspect-auto lg:h-[min(62vh,540px)] lg:min-h-[420px] lg:grid-cols-4 lg:grid-rows-2 lg:gap-1.5 lg:bg-transparent">
          <div className="hidden rounded-l-2xl bg-white/10 lg:col-span-2 lg:row-span-2 lg:block" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`hidden bg-white/10 lg:block ${i === 1 ? 'rounded-tr-2xl' : ''} ${i === 3 ? 'rounded-br-2xl' : ''}`} />
          ))}
        </div>

        {/* Números */}
        <div className="mt-6 flex gap-8 border-b border-white/10 pb-6 lg:mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-7 w-14 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="space-y-2.5">
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-11/12 rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="space-y-4 rounded-2xl border border-white/10 p-6">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-9 w-2/3 rounded bg-white/10" />
              <div className="h-12 w-full rounded-full bg-white/10" />
              <div className="h-12 w-full rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
