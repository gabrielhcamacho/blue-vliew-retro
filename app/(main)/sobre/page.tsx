import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from '@/app/components/AnimatedSection';
import PillLink from '@/app/components/PillLink';
import { REGIONS } from '@/app/lib/regions';
import { BrandCurve } from '@/components/ui/brand-curve';
import { LineReveal } from '@/components/ui/line-reveal';
import { SeaHorizon } from '@/components/ui/sea-horizon';

export const metadata: Metadata = {
  title: 'Sobre a Blueview | Quem Somos',
  description:
    'A Blueview transforma oportunidades do mercado imobiliário em patrimônio, rentabilidade e qualidade de vida. Imóveis de médio e alto padrão no litoral catarinense.',
};

// Na ordem em que a Blueview apresenta as regiões
const regionOrder = ['Itapema', 'Porto Belo', 'Balneário Camboriú', 'Praia Brava'];
const regions = regionOrder.map((name) => REGIONS.find((r) => r.name === name)!);

const steps = [
  {
    title: 'Entendimento do objetivo',
    text: 'Antes de qualquer imóvel, a conversa é sobre você: morar, investir, diversificar ou proteger patrimônio. O seu momento de vida define a busca.',
  },
  {
    title: 'Curadoria das oportunidades',
    text: 'Entre os empreendimentos das construtoras mais sólidas da região, selecionamos só os que fazem sentido para o seu objetivo.',
  },
  {
    title: 'Análise do imóvel e do contexto',
    text: 'Valorização, liquidez, potencial de rentabilidade e segurança patrimonial avaliados antes de qualquer proposta.',
  },
  {
    title: 'Negociação e acompanhamento',
    text: 'Conduzimos a negociação com transparência e seguimos ao seu lado da primeira visita à entrega das chaves.',
  },
];

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.3em]';

export default function SobrePage() {
  return (
    <div className="overflow-x-clip bg-night text-white">
      {/* ── Abertura: a curva da marca atravessa a página como horizonte ── */}
      <section className="relative isolate flex min-h-[640px] flex-col justify-end px-4 pb-14 pt-32 sm:px-6 md:min-h-[88svh] md:pb-20 lg:px-8">
        <SeaHorizon horizon={64} spread={0.4} className="-z-10" />
        <BrandCurve
          onMount
          delay={0.5}
          strokeWidth={1.5}
          className="absolute left-[-18%] top-[18%] -z-10 h-[58%] w-[136%] opacity-70 md:left-[-4%] md:top-[14%] md:w-[108%]"
        />

        <div className="mx-auto w-full max-w-7xl">
          <p className={`${eyebrow} mb-6 text-azure`}>[ Sobre ] Blueview Imóveis</p>
          <h1 className="max-w-5xl font-display text-[clamp(2.6rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            <LineReveal
              onMount
              delay={0.15}
              lines={[
                'Imóveis com vista',
                <span key="l2">
                  para o <span className="text-azure">litoral</span>
                </span>,
                <span key="l3" className="text-azure">catarinense.</span>,
              ]}
            />
          </h1>

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Especializada em imóveis de médio e alto padrão, a Blueview conecta investidores e famílias
              aos empreendimentos das construtoras mais sólidas e reconhecidas da região.
            </p>
            <p className={`${eyebrow} text-white/45`}>27°05′S · 48°36′W · Itapema, SC</p>
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-8">
          <p className={`${eyebrow} text-accent lg:col-span-2 lg:pt-4`}>[ 01 ] Manifesto</p>
          <h2 className="font-display text-[clamp(2rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em] lg:col-span-7">
            <LineReveal
              lines={[
                'Mais do que apresentar',
                'imóveis, ajudamos você',
                <span key="m3">
                  a tomar <span className="text-accent">decisões</span>
                </span>,
                <span key="m4">
                  <span className="text-accent">patrimoniais</span> no litoral.
                </span>,
              ]}
            />
          </h2>
          <AnimatedSection animation="fade-up" delay={200} className="lg:col-span-3 lg:self-end">
            <div className="border-l border-azure/40 pl-5">
              <p className="text-sm leading-relaxed text-white/65 sm:text-base">
                Intermediar negociações é só uma parte. A Blueview entrega <strong className="font-medium text-white">inteligência imobiliária</strong>:
                cada oportunidade é lida com foco em valorização, liquidez e segurança patrimonial, para
                que a decisão seja tomada com confiança e visão de longo prazo.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Onde atuamos: faixa editorial, a descrição aparece no hover/foco ── */}
      <section className="relative border-y border-white/10 bg-night-soft/50">
        <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={`${eyebrow} mb-3 text-azure`}>[ 02 ] Onde atuamos</p>
              <h2 className="font-display text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                Quatro endereços, uma mesma costa.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/55">
              As regiões mais valorizadas do litoral catarinense, a poucos quilômetros umas das outras.
            </p>
          </div>
        </div>

        <ul className="mx-auto mt-10 grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((r, i) => (
            <li key={r.name} className="border-t border-white/10 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0">
              <Link
                href={r.href}
                className="group relative flex h-full min-h-[15rem] flex-col px-4 pb-8 pt-6 outline-none transition-colors duration-500 hover:bg-white/[0.03] focus-visible:bg-white/[0.04] sm:px-6 lg:px-8"
              >
                {/* Linha que cresce no topo do item */}
                <span className="absolute inset-x-0 top-[-1px] h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-azure transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
                <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-azure/60 transition-colors group-hover:bg-accent group-focus-visible:bg-accent" />
                    0{i + 1}
                  </span>
                  {r.coords}
                </span>
                <span className="mt-8 font-display text-3xl font-medium leading-none tracking-[-0.04em] sm:text-[2.1rem]">
                  {r.name}
                </span>
                {/* Em telas de toque a descrição fica sempre visível */}
                <span className="mt-4 max-w-xs text-sm leading-relaxed text-white/60 transition-all duration-500 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 motion-reduce:transition-none">
                  {r.short}
                </span>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors group-hover:text-azure group-focus-visible:text-azure">
                  Ver imóveis <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Como a Blueview trabalha: percurso vertical ── */}
      <section className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className={`${eyebrow} mb-4 text-azure`}>[ 03 ] Método</p>
              <h2 className="font-display text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">
                Como a Blueview trabalha.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base">
                Atendimento consultivo, do primeiro contato à entrega das chaves. Cada etapa prepara a próxima.
              </p>
            </div>
          </div>

          <ol className="relative lg:col-span-7 lg:col-start-6">
            {/* Trilho do percurso */}
            <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-3 w-px bg-gradient-to-b from-accent via-azure/50 to-transparent sm:left-[1.35rem]" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative pb-14 pl-14 last:pb-0 sm:pl-20">
                <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-night font-mono text-xs text-white/80 sm:h-11 sm:w-11">
                  0{i + 1}
                </span>
                <AnimatedSection animation="fade-up" delay={i * 60}>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">{s.text}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Princípios: composição tipográfica, um princípio domina ── */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className={`${eyebrow} mb-8 text-azure`}>[ 04 ] Princípios</p>

          <AnimatedSection animation="fade-up">
            <div className="grid items-end gap-6 border-b border-white/10 pb-10 lg:grid-cols-12">
              <h3 className="font-display text-[clamp(3rem,12.5vw,8.25rem)] font-medium leading-[0.85] tracking-[-0.06em] lg:col-span-9">
                Transpa<span className="text-accent">rência</span>
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-white/60 lg:col-span-3 lg:pb-3">
                A base de tudo. Negociações claras sustentam valor real para clientes, parceiros e construtoras.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-8">
            <AnimatedSection animation="fade-up" className="md:col-span-5">
              <h3 className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-5xl">
                Inteligência <span className="text-azure">imobiliária</span>
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                Informação, estratégia e visão de longo prazo em cada recomendação.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={100} className="md:col-span-3 md:pt-10">
              <h3 className="font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Relacionamento</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Uma equipe que entende seus objetivos e acompanha você de perto.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={200} className="md:col-span-4 md:pt-20">
              <h3 className="font-display text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                Visão <span className="text-azure">patrimonial</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Imóvel como parte da construção de patrimônio, de forma consistente, segura e sustentável.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Encerramento: o arco laranja nasce do horizonte ── */}
      <section className="relative isolate overflow-hidden px-4 pb-24 pt-28 sm:px-6 md:pb-32 md:pt-40 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3"
          style={{ background: 'radial-gradient(60% 70% at 50% 100%, rgba(255,117,31,0.22), rgba(15,3,146,0.25) 55%, transparent)' }}
        />
        <BrandCurve
          show="arc"
          strokeWidth={2}
          className="absolute bottom-[-6%] left-1/2 -z-10 h-[98%] w-[260%] -translate-x-1/2 md:h-[97%] md:w-[120%]"
        />
        <BrandCurve
          show="wave"
          delay={0.6}
          strokeWidth={1}
          className="absolute bottom-[-4%] left-1/2 -z-10 h-[24%] w-[200%] -translate-x-1/2 opacity-60 md:bottom-[-4%] md:h-[26%] md:w-[110%]"
        />

        <AnimatedSection animation="fade-up" className="relative mx-auto max-w-3xl text-center">
          <p className={`${eyebrow} mb-5 text-azure`}>Blueview Imóveis. Viva com vista para o mar.</p>
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-[-0.045em]">
            Vamos conversar sobre o seu próximo <span className="text-accent">endereço</span> no litoral?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            Conte o que você procura. A gente devolve uma seleção pensada para o seu objetivo.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <PillLink href="/contato">Falar com a Blueview</PillLink>
            <Link
              href="/imoveis"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 underline-offset-8 transition-colors hover:text-azure hover:underline focus-visible:text-azure"
            >
              Conhecer os imóveis
            </Link>
          </div>
          <Link
            href="/investir"
            className="mt-6 inline-block text-sm text-white/45 transition-colors hover:text-white"
          >
            É investidor? Veja a área do investidor →
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
