import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ImageIcon } from 'lucide-react';
import type { BlogPost } from '@/app/lib/types';
import { isExternalImage } from '@/app/lib/utils';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  /** Matéria principal da página: imagem grande e texto ao lado, sem caixa. */
  featured?: boolean;
  /** Cards da primeira linha da grade, um pouco maiores. */
  large?: boolean;
  /** Card deitado (imagem ao lado do texto), para fechar uma linha que sobraria com um só. */
  wide?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function Cover({ post, sizes, className }: { post: BlogPost; sizes: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-night-soft', className)}>
      {post.cover_image ? (
        <Image
          src={post.cover_image}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none"
          sizes={sizes}
          unoptimized={isExternalImage(post.cover_image)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-night text-white/25">
          <ImageIcon className="h-10 w-10" strokeWidth={1} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
      {/* Linha colorida revelada no hover/foco */}
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-azure to-accent transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
    </div>
  );
}

export default function BlogCard({ post, featured = false, large = false, wide = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid gap-7 rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-azure lg:grid-cols-12 lg:items-center lg:gap-10"
      >
        <Cover
          post={post}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="aspect-[16/10] rounded-2xl lg:col-span-7"
        />
        <article className="lg:col-span-5">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Em destaque
            </span>
            <span className="text-azure">{post.category}</span>
          </p>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-5 line-clamp-4 text-base leading-relaxed text-white/65">{post.excerpt}</p>
          )}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <time dateTime={post.created_at} className="text-xs text-white/45">
              {formatDate(post.created_at)}
            </time>
            <span className="inline-flex items-center gap-3 text-sm font-medium text-white">
              <span className="relative">
                Ler artigo
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-focus-visible:border-accent group-focus-visible:bg-accent">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure"
    >
      <article
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-night-soft/60 transition-[border-color,background-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-azure/30 group-hover:bg-night-soft motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
          wide && 'sm:flex-row',
        )}
      >
        <Cover
          post={post}
          sizes={large ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className={cn(
            large ? 'aspect-[16/9]' : 'aspect-[4/3]',
            wide && 'sm:aspect-auto sm:min-h-[16rem] sm:w-1/2 sm:shrink-0',
          )}
        />
        <div className={cn('flex flex-1 flex-col p-5 sm:p-6', wide && 'lg:p-10')}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure">{post.category}</p>
          <h3
            className={cn(
              'mt-3 line-clamp-3 font-display font-medium leading-snug tracking-[-0.02em] text-white',
              large || wide ? 'text-2xl' : 'text-lg',
            )}
          >
            {post.title}
          </h3>
          {post.excerpt && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">{post.excerpt}</p>}
          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <time dateTime={post.created_at} className="text-xs text-white/40">
              {formatDate(post.created_at)}
            </time>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 transition-colors group-hover:text-accent group-focus-visible:text-accent">
              Ler artigo
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
