import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchBlogPost, fetchBlogPosts } from '@/app/lib/rehut-api';
import { isExternalImage } from '@/app/lib/utils';
import BlogViewTracker from '@/app/components/BlogViewTracker';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: 'Post não encontrado' };

  return {
    title: post.seo_title || `${post.title} | Blueview Blog`,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: post.cover_image
      ? { images: [{ url: post.cover_image }] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const [post, recentData] = await Promise.all([
    fetchBlogPost(slug),
    fetchBlogPosts({ limit: 5 }),
  ]);

  if (!post) notFound();

  const recentPosts = recentData.data.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="bg-night min-h-screen pt-28 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2">
            <BlogViewTracker postId={post.id} />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm mb-6 hover:underline"
              style={{ color: '#76d3f6' }}
            >
              ← Voltar ao blog
            </Link>

            {/* Category */}
            <span
              className="inline-block text-xs font-semibold px-2 py-1 rounded mb-4"
              style={{ backgroundColor: 'rgba(118,211,246,0.1)', color: '#76d3f6' }}
            >
              {post.category}
            </span>

            <h1 className="text-3xl font-bold text-white leading-tight mb-4">{post.title}</h1>

            <time className="text-sm text-white/45 block mb-6">
              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </time>

            {post.cover_image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  unoptimized={isExternalImage(post.cover_image)}
                />
              </div>
            )}

            {/* Content — HTML from Rehut rich-text editor */}
            <div
              className="prose prose-invert prose-lg max-w-none prose-img:rounded-xl prose-img:w-full prose-a:text-azure"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {recentPosts.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h3 className="font-bold text-white mb-4">Artigos recentes</h3>
                  <ul className="space-y-4">
                    {recentPosts.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="flex gap-3 group"
                        >
                          {p.cover_image && (
                            <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden">
                              <Image
                                src={p.cover_image}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized={isExternalImage(p.cover_image)}
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-[#0f0392] transition-colors leading-tight">
                              {p.title}
                            </p>
                            <p className="text-xs text-white/45 mt-1">
                              {new Date(p.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div
                className="rounded-xl p-6 text-white text-center"
                style={{ backgroundColor: '#1f4fd1' }}
              >
                <h3 className="font-bold text-lg mb-2">Encontre seu imóvel</h3>
                <p className="text-sm text-white/80 mb-4">
                  Temos o imóvel perfeito para você na região
                </p>
                <Link
                  href="/imoveis"
                  className="btn-white inline-block font-semibold text-sm px-5 py-2.5 rounded-lg"
                >
                  Ver imóveis →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
