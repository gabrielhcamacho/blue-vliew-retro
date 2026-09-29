// Skeleton com o mesmo formato do PropertyCard (imagem 4:3, localização, título, specs, preço, CTA).
export default function PropertyCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm h-full flex flex-col animate-pulse">
      <div className="relative aspect-[4/3] bg-white/10 flex-shrink-0" />
      <div className="p-4 flex flex-col flex-1">
        <div className="h-3 w-1/2 bg-white/10 rounded mb-3" />
        <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
        <div className="h-4 w-2/3 bg-white/10 rounded mb-4" />
        <div className="flex items-center gap-4 mt-auto mb-3">
          <div className="h-3 w-12 bg-white/10 rounded" />
          <div className="h-3 w-12 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
        <div className="h-6 w-1/2 bg-white/10 rounded mb-3" />
        <div className="h-10 w-full bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
