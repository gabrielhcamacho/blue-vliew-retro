import type { Metadata } from 'next';
import { fetchAllProperties, fetchSiteConfig } from '@/app/lib/rehut-api';
import { isLancamento, whatsappUrl } from '@/app/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SearchBar from '@/app/components/SearchBar';
import { PrismaHero, type PrismaHeroNavItem } from '@/components/ui/prisma-hero';
import AnimatedSection from '@/app/components/AnimatedSection';
import PropertyCarousel from '@/app/components/PropertyCarousel';

export const metadata: Metadata = {
  // absolute: o template do layout ("%s | Blueview Imóveis") repetiria o nome da marca.
  title: { absolute: 'Blueview Imóveis | Alto Padrão em Balneário Camboriú e região' },
  description:
    'Especialistas em imóveis de alto padrão em Balneário Camboriú e região. Apartamentos, coberturas e lançamentos exclusivos no litoral catarinense.',
};

const heroNav: PrismaHeroNavItem[] = [
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'Lançamentos', href: '/imoveis?status_imovel=lancamento' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
];

export default async function HomePage() {
  const [configData, propertiesData] = await Promise.all([
    fetchSiteConfig(),
    // Catálogo inteiro, e não só a primeira página: os lançamentos vêm do DWV, que a API
    // devolve depois de todos os imóveis próprios.
    fetchAllProperties(),
  ]);

  const waLink = configData.whatsapp
    ? whatsappUrl(configData.whatsapp, 'Olá! Tenho um imóvel e gostaria de anunciá-lo com a Blueview.')
    : '/contato';

  const ctaCards = [
    {
      eyebrow: '[ 04 ] Proprietários',
      title: 'Você é proprietário de um imóvel e deseja anunciá-lo aqui?',
      cta: 'Fale com um corretor',
      href: waLink,
      external: Boolean(configData.whatsapp),
      image: '/proprietario.avif',
    },
    {
      eyebrow: '[ 05 ] Investidores',
      title: 'Procurando o melhor investimento? Você não precisa fazer isso sozinho.',
      cta: 'Receba uma consultoria',
      href: '/investir',
      external: false,
      image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const all = propertiesData.data;
  const featured = all.slice(0, 6);
  const lancamentos = all.filter(isLancamento);
  const section2 = lancamentos.length > 0 ? lancamentos.slice(0, 6) : all.slice(6, 12);
  const hasSection2 = section2.length > 0;

  return (
    <div className="bg-night text-white">
      <PrismaHero
        title="Blueview"
        eyebrow="[ Blueview Imóveis ] Litoral catarinense"
        description={`${configData.hero_title}. Apartamentos, coberturas e lançamentos escolhidos a dedo, com o olhar de quem vive o litoral.`}
        ctaLabel="Ver imóveis"
        ctaHref="/imoveis"
        navItems={heroNav}
        videoSrc="/video-city.mp4"
        posterSrc="/video-city-poster.jpg"
      />

      {/* Busca: continua o pôr do sol do hero num brilho baixo, com a grade quase apagada */}
      <section className="relative overflow-hidden px-4 py-12 sm:py-16">
        <div className="retro-grid pointer-events-none absolute inset-0 opacity-35" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,117,31,0.45), rgba(118,211,246,0.35), transparent)' }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[56rem] max-w-full -translate-x-1/2 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,117,31,0.14), rgba(15,3,146,0.2) 60%, transparent)' }}
        />
        <AnimatedSection animation="fade-up">
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-azure">[ 01 ] Busca</p>
                <h2 className="font-display text-3xl font-medium tracking-[-0.04em] sm:text-5xl">
                  Encontre seu próximo <span className="text-accent">endereço</span>.
                </h2>
              </div>
              <Link
                href="/imoveis"
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-azure"
              >
                Pesquisa avançada
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <SearchBar />
          </div>
        </AnimatedSection>
      </section>

      {/* Seção 1: Imóveis em Destaque */}
      {featured.length > 0 && (
        <AnimatedSection animation="fade-up">
          <PropertyCarousel
            properties={featured}
            eyebrow="[ 02 ] Destaques"
            title="Imóveis em destaque"
            subtitle="Passe o mouse sobre o card para ver os detalhes"
            viewAllHref="/imoveis"
          />
        </AnimatedSection>
      )}

      {/* Seção 2: Lançamentos (ou mais imóveis) */}
      {hasSection2 && (
        <AnimatedSection animation="fade-up" delay={80}>
          <div className="bg-night-soft/40">
            <PropertyCarousel
              properties={section2}
              eyebrow="[ 03 ] Futuro"
              title={lancamentos.length > 0 ? 'Lançamentos' : 'Mais imóveis'}
              subtitle={
                lancamentos.length > 0
                  ? 'Os melhores lançamentos de Balneário Camboriú e região'
                  : 'Explore mais opções do nosso portfólio'
              }
              viewAllHref={
                lancamentos.length > 0 ? '/imoveis?status_imovel=lancamento' : '/imoveis'
              }
            />
          </div>
        </AnimatedSection>
      )}

      {/* Seção dois cards: Anunciar / Investir */}
      <AnimatedSection animation="fade-up">
        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2">
            {ctaCards.map((card) => (
              <div
                key={card.title}
                className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-border p-8 md:p-10"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-primary/40" />
                <div className="scanlines pointer-events-none absolute inset-0" />
                <div className="relative z-10">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-azure">{card.eyebrow}</p>
                  <h3 className="max-w-sm font-display text-2xl font-medium leading-snug tracking-[-0.03em] sm:text-3xl">
                    {card.title}
                  </h3>
                </div>
                <a
                  href={card.href}
                  {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group/cta relative z-10 mt-8 inline-flex items-center gap-2 self-start rounded-full bg-accent py-1 pl-5 pr-1 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-accent-dark"
                >
                  {card.cta}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night transition-transform group-hover/cta:scale-110">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
