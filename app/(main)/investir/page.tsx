import type { Metadata } from 'next';
import Link from 'next/link';
import InvestmentForm from '@/app/components/InvestmentForm';
import AnimatedSection from '@/app/components/AnimatedSection';
import PillLink from '@/app/components/PillLink';
import PropertyCarousel from '@/app/components/PropertyCarousel';
import { fetchAllProperties, fetchSiteConfig } from '@/app/lib/rehut-api';
import { isLancamento, whatsappUrl } from '@/app/lib/utils';
import { REGIONS } from '@/app/lib/regions';
import { CoastMap } from '@/components/ui/coast-map';
import { LineReveal } from '@/components/ui/line-reveal';
import { BrandCurve } from '@/components/ui/brand-curve';
import RegionExplorer from './RegionExplorer';

export const metadata: Metadata = {
  title: 'Investimentos Imobiliários | Blueview Imóveis',
  description:
    'Cadastre-se e receba oportunidades de investimento imobiliário de médio e alto padrão em Itapema, Porto Belo, Balneário Camboriú e Praia Brava.',
};

const curation = [
  { title: 'Objetivo do cliente', text: 'Renda, valorização, uso próprio ou diversificação. Tudo parte daqui.' },
  { title: 'Localização', text: 'Distância do mar, vista, entorno e o que está previsto para a região.' },
  { title: 'Construtora e empreendimento', text: 'Histórico de entregas, padrão construtivo e projeto.' },
  { title: 'Condições comerciais', text: 'Tabela, fluxo de pagamento e fase da obra no momento da entrada.' },
  { title: 'Liquidez e horizonte', text: 'Por quanto tempo o capital fica no imóvel e como sair dele depois.' },
  { title: 'Acompanhamento', text: 'Negociação conduzida pela Blueview até a assinatura e a entrega.' },
];

const deliverables = [
  'Uma conversa com um especialista da Blueview para entender seu objetivo e sua faixa de investimento.',
  'Uma seleção de imóveis e lançamentos alinhada ao seu perfil, sem lista genérica.',
  'A leitura de cada opção: localização, construtora, condições e horizonte.',
  'Acompanhamento na negociação, se decidir seguir com alguma delas.',
];

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.3em]';

export default async function InvestirPage() {
  const [config, properties] = await Promise.all([fetchSiteConfig(), fetchAllProperties()]);

  const lancamentos = properties.data.filter(isLancamento);
  const selection = (lancamentos.length > 0 ? lancamentos : properties.data).slice(0, 6);

  const specialistHref = config.whatsapp
    ? whatsappUrl(config.whatsapp, 'Olá! Quero conversar com um especialista sobre investimento no litoral.')
    : '/contato';

  return (
    <div className="overflow-x-clip bg-night text-white">
      {/* ── Abertura: texto à esquerda, leitura do território à direita ── */}
      <section className="relative isolate px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(50% 60% at 78% 45%, rgba(15,3,146,0.55), transparent 70%), radial-gradient(35% 40% at 85% 85%, rgba(255,117,31,0.12), transparent 70%)',
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <p className={`${eyebrow} mb-6 text-azure`}>[ Investir ] Área do investidor</p>
            <h1 className="font-display text-[clamp(2.6rem,5.4vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.05em]">
              <LineReveal
                onMount
                delay={0.1}
                lines={[
                  'Invista onde',
                  'o litoral encontra',
                  <span key="v" className="text-azure">valor.</span>,
                ]}
              />
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              A Blueview seleciona imóveis e lançamentos de médio e alto padrão no litoral catarinense e lê
              cada oportunidade com o olhar de quem atua na região todos os dias.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <PillLink href="#cadastro">Receber oportunidades</PillLink>
              <Link
                href={specialistHref}
                {...(config.whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="border-b border-white/25 pb-1 text-sm text-white/80 transition-colors hover:border-azure hover:text-azure"
              >
                Falar com um especialista
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none">
            <CoastMap className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* ── Por que a Blueview: blocos de pesos diferentes ── */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className={`${eyebrow} mb-4 text-azure`}>[ 01 ] Por que a Blueview</p>
            <h2 className="font-display text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">
              Investir no litoral pede leitura de perto.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            <AnimatedSection animation="fade-up" className="lg:col-span-7 lg:row-span-2">
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-night-soft p-7 sm:p-10">
                <BrandCurve show="wave" strokeWidth={1} className="absolute -right-10 bottom-10 h-40 w-[120%] opacity-50" />
                <span className="font-display text-[5.5rem] font-medium leading-none tracking-[-0.06em] text-accent/90 sm:text-[7rem]">01</span>
                <h3 className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Conhecimento local</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                  Quem atua na região sabe o que muda de uma quadra para outra, qual construtora entrega o
                  que promete e em que fase uma obra faz mais sentido. É essa leitura que orienta cada
                  recomendação.
                </p>
                <ul className="relative mt-10 grid grid-cols-2 gap-x-6 border-t border-white/10 pt-5 sm:mt-auto">
                  {REGIONS.map((r) => (
                    <li key={r.name} className="flex items-center gap-2 py-1.5 text-sm text-white/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {r.name}
                    </li>
                  ))}
                </ul>
              </article>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100} className="lg:col-span-5">
              <article className="h-full rounded-2xl border border-white/12 p-7 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-medium tracking-[-0.03em]">Curadoria de oportunidades</h3>
                  <span className="font-mono text-xs text-white/40">02</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Você não recebe o catálogo inteiro. Recebe o que foi filtrado para o seu objetivo, entre os
                  empreendimentos das construtoras mais sólidas da região.
                </p>
              </article>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={180} className="lg:col-span-5">
              <article className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-azure/[0.09] to-transparent p-7 sm:p-8">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-azure to-transparent" />
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-medium tracking-[-0.03em]">Visão patrimonial</h3>
                  <span className="font-mono text-xs text-azure/70">03</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Cada imóvel é pensado como parte do seu patrimônio: valorização, liquidez e segurança
                  entram na conta junto com o preço.
                </p>
              </article>
            </AnimatedSection>
          </div>

          {/* Faixa complementar */}
          <AnimatedSection animation="fade-up" delay={120}>
            <dl className="mt-4 grid border-y border-white/10 sm:grid-cols-3">
              {[
                ['Acompanhamento', 'Da primeira conversa à entrega das chaves.'],
                ['Lançamentos', 'Acesso aos lançamentos das construtoras parceiras.'],
                ['Negociação', 'Suporte na proposta, nas condições e na assinatura.'],
              ].map(([t, d], i) => (
                <div key={t} className={`py-6 sm:px-6 ${i ? 'border-t border-white/10 sm:border-l sm:border-t-0' : 'sm:pl-0'}`}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{t}</dt>
                  <dd className="mt-2 text-sm text-white/70">{d}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>
        </div>
      </section>

      {/* ── O litoral como mercado: momento de mais luz ── */}
      <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, #0a0450 0%, #140a6a 55%, #0a0450 100%)' }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className={`${eyebrow} mb-4 text-azure`}>[ 02 ] O litoral como mercado</p>
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              <LineReveal lines={['A mesma costa,', 'mercados diferentes', 'a cada enseada.']} />
            </h2>
          </div>
          <AnimatedSection animation="fade-up" className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="text-base leading-relaxed text-white/75">
              Itapema, Porto Belo, Balneário Camboriú e Praia Brava ficam a poucos quilômetros umas das
              outras, mas cada uma tem sua dinâmica. O que decide uma boa compra não é só a região: é a
              construtora, a localização dentro dela e o momento de entrada.
            </p>
            <p className="mt-4 text-sm text-white/50">
              Por isso a Blueview não promete rentabilidade. Mostra o que sabe e ajuda você a decidir.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Regiões acompanhadas ── */}
      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className={`${eyebrow} mb-10 text-azure`}>[ 03 ] Regiões acompanhadas</p>
          <RegionExplorer />
        </div>
      </section>

      {/* ── Processo de curadoria: percurso horizontal ── */}
      <section className="border-t border-white/10 bg-night-soft/40 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`${eyebrow} mb-4 text-azure`}>[ 04 ] Processo de curadoria</p>
              <h2 className="font-display text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">
                Como avaliamos uma oportunidade.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/55">Seis leituras, nesta ordem, antes de um imóvel chegar até você.</p>
          </div>

          <ol className="relative grid gap-0 md:grid-cols-3 lg:grid-cols-6">
            {/* Trilho: horizontal no desktop, vertical no celular */}
            <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-gradient-to-b from-accent via-azure/40 to-transparent lg:bottom-auto lg:left-0 lg:right-0 lg:top-[5px] lg:h-px lg:w-auto lg:bg-gradient-to-r" />
            {curation.map((c, i) => (
              <li key={c.title} className="relative pb-10 pl-8 md:pr-6 lg:pb-0 lg:pl-0 lg:pt-10">
                <span
                  aria-hidden
                  className={`absolute left-0 top-1 h-[11px] w-[11px] rounded-full border lg:top-0 ${
                    i === 0 ? 'border-accent bg-accent shadow-[0_0_10px_#ff751f]' : 'border-azure/60 bg-night'
                  }`}
                />
                <AnimatedSection animation="fade-up" delay={i * 70}>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-xl font-medium leading-tight tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Oportunidades selecionadas (dados reais do portfólio) ── */}
      {selection.length > 0 && (
        <AnimatedSection animation="fade-up">
          <PropertyCarousel
            properties={selection}
            eyebrow="[ 05 ] Oportunidades selecionadas"
            title={lancamentos.length > 0 ? 'Lançamentos em acompanhamento' : 'Imóveis em acompanhamento'}
            subtitle="Uma amostra do que a Blueview acompanha hoje. A seleção para o seu perfil vem depois da conversa."
            viewAllHref={lancamentos.length > 0 ? '/imoveis?status_imovel=lancamento' : '/imoveis'}
          />
        </AnimatedSection>
      )}

      {/* ── Conversão ── */}
      <section id="cadastro" className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(70% 55% at 20% 0%, rgba(255,117,31,0.16), transparent 70%), radial-gradient(60% 60% at 90% 100%, rgba(15,3,146,0.5), transparent 70%)' }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-accent via-accent/40 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className={`${eyebrow} mb-4 text-accent`}>[ 06 ] Cadastro</p>
            <h2 className="font-display text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">
              Conte seu objetivo. A seleção vem depois.
            </h2>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.15em] text-white/50">O que você recebe</p>
            <ol className="mt-4 space-y-4">
              {deliverables.map((d, i) => (
                <li key={d} className="flex gap-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  {d}
                </li>
              ))}
            </ol>
          </div>
          <AnimatedSection animation="fade-up" delay={100} className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-2xl border border-white/10 bg-night-soft/80 p-6 shadow-[0_40px_120px_-40px_rgba(255,117,31,0.35)] sm:p-8">
              <InvestmentForm />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
