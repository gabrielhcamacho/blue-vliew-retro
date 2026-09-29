'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, ChevronDown, ArrowUpRight } from 'lucide-react';
import type { SiteConfig } from '@/app/lib/types';
import { whatsappUrl } from '@/app/lib/utils';

const propertyCategories = [
  { label: 'Todo o portfólio', href: '/imoveis' },
  { label: 'Imóveis à venda', href: '/imoveis?purpose=venda' },
  { label: 'Imóveis para alugar', href: '/imoveis?purpose=aluguel' },
  { label: 'Lançamentos', href: '/imoveis?status_imovel=lancamento' },
  { label: 'Coberturas', href: '/imoveis?tipo_apt=cobertura' },
  { label: 'Investimentos', href: '/investir' },
];

interface HeaderProps {
  config?: SiteConfig;
}

export default function Header({ config }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    dropdownCloseTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';
  // Versão retro: o header é sempre vidro escuro com a logo em branco.
  // Na home o hero tem o próprio menu (aba no topo), então o header só desce depois do hero.
  const hidden = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    if (!isHome) return;
    const fn = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [isHome]);

  const whatsappLink = config?.whatsapp
    ? whatsappUrl(config.whatsapp, 'Olá! Gostaria de falar com um corretor.')
    : '/contato';

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const navLink = 'nav-roll text-sm font-medium text-white/75 transition-colors hover:text-white';

  return (
    <header
      // Na home ele desce e aparece aos poucos ao sair do hero; com movimento reduzido só aparece (fade)
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity motion-reduce:duration-300 ${
        hidden ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{
        backgroundColor: 'rgba(5,1,58,0.82)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Fio de luz em degradê na base do header */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-azure/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-column grid: nav | logo | actions */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-20">
          {/* Left: nav links */}
          <nav className="flex items-center gap-6">
            <NavLink href="/blog" label="Blog" className={navLink} active={isActive('/blog')} />
            <NavLink href="/sobre" label="Sobre" className={navLink} active={isActive('/sobre')} />

            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                className={`${navLink} gap-1`}
                aria-expanded={dropdownOpen}
                aria-current={isActive('/imoveis') ? 'page' : undefined}
                onClick={() => setDropdownOpen((o) => !o)}
              >
                <span className="nav-roll-text" data-text="Ver imóveis">Ver imóveis</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-accent' : ''}`}
                />
              </button>
              <div
                className={`absolute top-full left-0 mt-3 w-60 origin-top rounded-2xl border border-border p-2 z-50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                  dropdownOpen
                    ? 'visible opacity-100 translate-y-0 scale-100'
                    : 'invisible opacity-0 -translate-y-2 scale-95'
                }`}
                style={{ backgroundColor: 'rgba(8,3,72,0.96)', backdropFilter: 'blur(20px)' }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-azure/70">
                  [ Portfólio ]
                </p>
                {propertyCategories.map((cat, i) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setDropdownOpen(false)}
                    className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                    style={{ transitionDelay: dropdownOpen ? `${i * 25}ms` : '0ms' }}
                  >
                    {/* Barrinha em degradê que acende à esquerda */}
                    <span className="h-4 w-0.5 origin-center scale-y-0 rounded-full bg-gradient-to-b from-azure to-accent transition-transform duration-300 group-hover/item:scale-y-100" />
                    <span className="transition-transform duration-300 group-hover/item:translate-x-1">
                      {cat.label}
                    </span>
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>

            <NavLink
              href="/investir"
              label="Área do investidor"
              className={navLink}
              active={isActive('/investir')}
            />
          </nav>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Link href="/" className="transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_rgba(118,211,246,0.7)]">
              <Image
                src="/logo-blueview.png"
                alt="Blueview Imóveis"
                width={95}
                height={64}
                className="h-16 w-auto brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center justify-end gap-5">
            <Link
              href="/favoritos"
              aria-current={isActive('/favoritos') ? 'page' : undefined}
              className={`${navLink} group/fav gap-1.5`}
            >
              <Heart className="w-4 h-4 transition-all duration-300 group-hover/fav:scale-110 group-hover/fav:fill-accent group-hover/fav:text-accent" />
              <span className="nav-roll-text" data-text="Meus favoritos">Meus favoritos</span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group/wa inline-flex items-center gap-2 rounded-full py-1 pl-4 pr-1 text-sm font-semibold"
            >
              Falar no WhatsApp
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night transition-transform duration-300 group-hover/wa:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between h-16">
          <Link href="/">
            <Image
              src="/logo-blueview.png"
              alt="Blueview Imóveis"
              width={77}
              height={52}
              className="h-13 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <button
            className="p-2 text-white/80"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border" style={{ backgroundColor: 'rgba(5,1,58,0.98)' }}>
          <div className="px-4 py-4 space-y-3">
            <Link href="/blog" className="block text-white/80 hover:text-azure font-medium" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            <Link href="/sobre" className="block text-white/80 hover:text-azure font-medium" onClick={() => setMobileOpen(false)}>
              Sobre
            </Link>
            <Link href="/imoveis" className="block text-white/80 hover:text-azure font-medium" onClick={() => setMobileOpen(false)}>
              Ver imóveis
            </Link>
            {propertyCategories.slice(1).map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="block text-sm text-white/50 hover:text-azure pl-4"
                onClick={() => setMobileOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/investir"
              className="block text-white/80 hover:text-azure font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Área do investidor
            </Link>
            <Link
              href="/favoritos"
              className="flex items-center gap-1.5 text-white/80 hover:text-azure font-medium"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className="w-4 h-4" />
              Meus favoritos
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2.5 rounded-full text-sm font-semibold text-center block mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/** Link do menu com a animação "nav-roll" (texto rola e a linha em degradê cresce). */
function NavLink({
  href,
  label,
  className,
  active,
}: {
  href: string;
  label: string;
  className: string;
  active: boolean;
}) {
  return (
    <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
      <span className="nav-roll-text" data-text={label}>
        {label}
      </span>
    </Link>
  );
}
