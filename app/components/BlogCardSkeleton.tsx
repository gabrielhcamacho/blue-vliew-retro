import { cn } from '@/lib/utils';

// Skeleton com o mesmo formato do BlogCard (matéria principal, cards grandes e cards comuns).
export default function BlogCardSkeleton({ featured = false, large = false }: { featured?: boolean; large?: boolean }) {
  if (featured) {
    return (
      <div className="grid animate-pulse gap-7 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="aspect-[16/10] rounded-2xl bg-white/10 lg:col-span-7" />
        <div className="lg:col-span-5">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="mt-5 h-9 w-full rounded bg-white/10" />
          <div className="mt-2 h-9 w-2/3 rounded bg-white/10" />
          <div className="mt-5 h-3 w-full rounded bg-white/10" />
          <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
          <div className="mt-8 h-10 border-t border-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-white/[0.08] bg-night-soft/60">
      <div className={cn('bg-white/10', large ? 'aspect-[16/9]' : 'aspect-[4/3]')} />
      <div className="p-5 sm:p-6">
        <div className="h-2.5 w-20 rounded bg-white/10" />
        <div className="mt-4 h-5 w-5/6 rounded bg-white/10" />
        <div className="mt-3 h-3 w-full rounded bg-white/10" />
        <div className="mt-6 h-3 w-24 rounded bg-white/10" />
      </div>
    </div>
  );
}
