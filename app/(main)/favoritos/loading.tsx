import PropertyCardSkeleton from '@/app/components/PropertyCardSkeleton';

// Skeleton dos favoritos — espelha app/(main)/favoritos/page.tsx (cabeçalho compacto, linha, grade).
export default function Loading() {
  return (
    <div className="bg-night min-h-screen px-4 pt-24 sm:px-6 md:pt-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="pb-6">
          <div className="mb-4 h-3 w-36 rounded bg-white/10 animate-pulse" />
          <div className="mb-3 h-3 w-44 rounded bg-white/10 animate-pulse" />
          <div className="h-10 w-64 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="h-px bg-gradient-to-r from-accent via-azure/50 to-transparent" />
        <div className="grid grid-cols-1 items-stretch gap-5 pb-12 pt-8 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
