import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';
import type { SiteConfig } from '@/app/lib/types';
import { whatsappUrl } from '@/app/lib/utils';

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface FooterProps {
  config?: SiteConfig;
}

const propertyLinks = [
  { label: 'Imóveis à venda', href: '/imoveis?purpose=venda' },
  { label: 'Imóveis para alugar', href: '/imoveis?purpose=aluguel' },
  { label: 'Apartamentos', href: '/imoveis?property_type=apartamento' },
  { label: 'Casas', href: '/imoveis?property_type=casa' },
  { label: 'Terrenos', href: '/imoveis?property_type=terreno' },
  { label: 'Lançamentos', href: '/imoveis?status_imovel=lancamento' },
];

const companyLinks = [
  { label: 'Sobre a Blueview', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
  { label: 'Área do investidor', href: '/investir' },
  { label: 'Meus favoritos', href: '/favoritos' },
  { label: 'Contato', href: '/contato' },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="nav-roll text-sm text-white/70 transition-colors hover:text-white">
      <span className="nav-roll-text" data-text={label}>
        {label}
      </span>
    </Link>
  );
}

export default function Footer({ config }: FooterProps) {
  const whatsappLink = config?.whatsapp
    ? whatsappUrl(config.whatsapp, 'Olá! Gostaria de mais informações.')
    : '/contato';

  const socials = (
    [
      { label: 'Instagram', href: config?.social_links?.instagram, Icon: IconInstagram },
      { label: 'Facebook', href: config?.social_links?.facebook, Icon: IconFacebook },
      { label: 'YouTube', href: config?.social_links?.youtube, Icon: IconYoutube },
      { label: 'LinkedIn', href: config?.social_links?.linkedin, Icon: IconLinkedin },
    ] as const
  ).filter((s): s is typeof s & { href: string } => !!s.href);

  const contacts = [
    config?.phone && { Icon: Phone, label: config.phone, href: `tel:${config.phone}` },
    config?.whatsapp && { Icon: MessageCircle, label: `WhatsApp ${config.whatsapp}`, href: whatsappLink, external: true },
    config?.email && { Icon: Mail, label: config.email, href: `mailto:${config.email}` },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; href: string; external?: boolean }[];

  return (
    <footer className="bg-night p-2 md:p-3">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#07023f] via-[#07023f] to-[#0d1a5c] md:rounded-[2rem]">
        <div className="retro-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />

        <div className="relative mx-auto max-w-7xl px-6 pt-14 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
            {/* Marca */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo-blueview.png"
                  alt="Blueview Imóveis"
                  width={120}
                  height={81}
                  className="h-14 w-auto brightness-0 invert"
                />
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-white/60">
                Transformando oportunidades do mercado imobiliário em patrimônio, rentabilidade e
                qualidade de vida.
              </p>
              {config?.creci && (
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure/70">{config.creci}</p>
              )}
            </div>

            {/* Imóveis */}
            <div className="space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-azure">[ Imóveis ]</h3>
              <ul className="space-y-2.5">
                {propertyLinks.map((l) => (
                  <li key={l.href}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Institucional */}
            <div className="space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-azure">[ Blueview ]</h3>
              <ul className="space-y-2.5">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-azure">[ Contato ]</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {contacts.map(({ Icon, label, href, external }) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group/c flex items-start gap-2.5 break-all transition-colors hover:text-white"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover/c:scale-110" />
                      {label}
                    </a>
                  </li>
                ))}
                {config?.branches?.map((branch) => (
                  <li key={branch.label} className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <span className="block font-medium text-white">{branch.label}</span>
                      {branch.address}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Segunda a domingo, das 8h às 19h
                </li>
              </ul>
            </div>
          </div>

          {/* Linha inferior: redes, copyright e webmail */}
          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_0_16px_rgba(255,117,31,0.45)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
              <p>© {new Date().getFullYear()} Blueview Imóveis. Todos os direitos reservados.</p>
              {/* TODO(BLUEVIEW): confirmar o domínio de webmail da Blueview. */}
              <a
                href="https://webmail.blueviewimoveis.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-azure"
              >
                <Mail className="h-3.5 w-3.5" />
                Webmail Corretor
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Nome gigante em contorno: se desenha ao aparecer e ganha degradê sob o cursor */}
        <div className="relative -mb-[2%] mt-2 px-2 sm:-mt-4 md:-mt-8">
          <TextHoverEffect text="BLUEVIEW" />
        </div>
      </div>
    </footer>
  );
}
