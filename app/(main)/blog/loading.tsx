import BlogCardSkeleton from '@/app/components/BlogCardSkeleton';

// Skeleton do blog — espelha app/(main)/blog/page.tsx (abertura, matéria principal, grade).
export default function Loading() {
  return (
    <div className="bg-night min-h-screen px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 h-3 w-40 rounded bg-white/10 animate-pulse" />
        <div className="h-14 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="mt-3 h-14 w-1/2 rounded bg-white/10 animate-pulse" />
        <div className="mt-10 h-px bg-white/10" />

        <div className="border-b border-white/10 pb-14 pt-10 md:pt-12">
          <BlogCardSkeleton featured />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <BlogCardSkeleton large />
          <BlogCardSkeleton large />
        </div>
      </div>
    </div>
  );
}
