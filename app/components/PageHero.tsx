import { WordsPullUp } from '@/components/ui/prisma-hero';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  /** Rótulo em mono acima do título, ex.: "[ Sobre ] Quem somos". */
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  /** Conteúdo extra abaixo da descrição (botões, busca...). */
  children?: React.ReactNode;
  className?: string;
  /** Hero mais baixo, para páginas de listagem. */
  compact?: boolean;
}

/**
 * Abertura das páginas internas na linguagem da home retro: painel escuro arredondado com
 * grade synthwave, granulado, scanlines e brilhos azure/salmão, título grande.
 */
export default function PageHero({ eyebrow, title, description, children, className, compact }: PageHeroProps) {
  return (
    <section className={cn('bg-night px-2 pt-[5.5rem] md:px-3', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-night-soft to-night md:rounded-[2rem]">
        <div className="retro-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-azure/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent/25 blur-[110px]" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
        <div className="scanlines pointer-events-none absolute inset-0" />

        <div
          className={cn(
            'relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12',
            compact ? 'py-10 md:py-14' : 'py-14 md:py-24',
          )}
        >
          <div>
            <p className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-azure sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#ff751f]" />
              {eyebrow}
            </p>
            <h1
              className={cn(
                'font-display font-medium leading-[0.9] tracking-[-0.05em] text-white',
                compact ? 'text-4xl sm:text-6xl' : 'text-5xl sm:text-7xl lg:text-8xl',
              )}
            >
              <WordsPullUp text={title} />
            </h1>
            {description && (
              <div className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">{description}</div>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
