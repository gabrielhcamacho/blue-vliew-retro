'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BedDouble, Bookmark, Car, Expand, MapPin, Sparkles, Zap } from 'lucide-react';
import type { Property } from '@/app/lib/types';
import { formatCurrency, isExternalImage, isLancamento, purposeLabel } from '@/app/lib/utils';
import { useFavorites } from '@/app/hooks/useFavorites';
import { PerspectiveFlipCard } from '@/components/ui/card-14';

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(property.id);
  const [flipped, setFlipped] = useState(false);

  const cover = property.images?.[0];
  const area = property.area_private ?? property.area_total;
  const price = property.purpose === 'aluguel' ? property.rental_price : property.price;
  const isRental = property.purpose === 'aluguel';
  const location = `${property.city}${property.neighborhood ? `, ${property.neighborhood}` : ''}`;
  const badge = isLancamento(property) ? 'Lançamento' : purposeLabel(property.purpose);

  const roomsLabel =
    property.suites > 0
      ? `${property.suites} suíte${property.suites > 1 ? 's' : ''}`
      : `${property.bedrooms} quarto${property.bedrooms !== 1 ? 's' : ''}`;
  const specs = [
    { icon: BedDouble, label: roomsLabel, z: 130 },
    {
      icon: Car,
      label: `${property.parking_spots} ${property.parking_spots === 1 ? 'vaga' : 'vagas'}`,
      z: 160,
    },
    { icon: Expand, label: area ? `${area} m²` : 'Área a consultar', z: 130 },
  ];

  const priceNode = price ? (
    <>
      {formatCurrency(price)}
      {isRental && <span className="text-xs font-normal text-muted-foreground">/mês</span>}
    </>
  ) : (
    <span className="text-sm font-medium text-muted-foreground">Consulte o preço</span>
  );

  const favoriteButton = (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(property.id);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-lg transition-colors ${
        favorited
          ? 'border-accent bg-accent hover:bg-accent-dark'
          : 'border-white/20 bg-night/70 backdrop-blur-md hover:bg-night'
      }`}
      aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
    >
      <Bookmark className={`h-4 w-4 text-white ${favorited ? 'fill-white' : ''}`} />
    </button>
  );

  const front = (
    <div className="flex size-full flex-col [transform-style:preserve-3d]">
      {/* Imagem (Z: 50px) */}
      <div className="relative h-60 w-full shrink-0 [transform-style:preserve-3d] [transform:translateZ(50px)]">
        <div className="absolute inset-0 overflow-hidden rounded-xl border border-border bg-night">
          {cover && (
            <Image
              src={cover}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
              unoptimized={isExternalImage(cover)}
              className="object-cover transition duration-700 group-hover/p-card:scale-110"
            />
          )}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
        </div>

        {/* Selo flutuante (Z: 80px) */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-night/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md [transform:translateZ(80px)]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#ff751f]" />
          {badge}
        </div>

        <div className="absolute right-4 top-4 [transform:translateZ(80px)]">{favoriteButton}</div>
      </div>

      {/* Conteúdo (Z: 60px) */}
      <div className="flex flex-grow flex-col justify-between px-4 pb-4 pt-6 [transform-style:preserve-3d]">
        <div className="space-y-2 [transform-style:preserve-3d] [transform:translateZ(60px)]">
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-azure">
            <Sparkles className="size-3.5" />
            <span>{property.property_code || 'Exclusivo Blueview'}</span>
          </div>
          <h3 className="line-clamp-2 font-display text-xl font-bold leading-tight tracking-tight text-card-foreground transition duration-300 group-hover/p-card:text-accent">
            {property.title}
          </h3>
          <p className="flex items-center gap-1.5 text-sm font-medium leading-none text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-accent" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 [transform:translateZ(40px)]">
          <p className="font-display text-lg font-bold text-white">{priceNode}</p>
          <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-all group-hover/p-card:translate-x-1 group-hover/p-card:text-accent">
            Ver mais
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );

  const back = (
    <div className="flex size-full flex-col items-center justify-center [transform-style:preserve-3d]">
      {/* Características (Z: 130–160px) */}
      <div className="mb-9 flex w-full justify-center gap-3 [transform-style:preserve-3d]">
        {specs.map(({ icon: Icon, label, z }) => (
          <div
            key={label}
            className="flex min-w-[88px] flex-col items-center gap-2 rounded-2xl border border-border bg-muted p-3.5 [transform-style:preserve-3d]"
            style={{ transform: `translateZ(${z}px)` }}
          >
            <div className="rounded-xl border border-border bg-card p-2 text-azure shadow-sm [transform:translateZ(20px)]">
              <Icon className="size-6" />
            </div>
            <p className="text-[11px] font-bold tracking-tight [transform:translateZ(10px)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Descrição (Z: 80px) */}
      <div className="space-y-3 px-2 [transform-style:preserve-3d]">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-azure [transform:translateZ(80px)]">
          Destaques do imóvel
        </p>
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight [transform:translateZ(80px)]">
          {property.title}
        </h3>
        <p className="font-display text-2xl font-bold text-accent [transform:translateZ(60px)]">{priceNode}</p>
      </div>

      {/* Ação (Z: 100px) */}
      <div className="mt-7 w-full px-2 [transform-style:preserve-3d]">
        <span className="flex h-11 w-full items-center justify-center rounded-xl bg-accent text-xs font-bold uppercase tracking-wider text-white shadow-[0_15px_30px_-5px_rgba(255,117,31,0.45)] transition-all hover:scale-[1.03] hover:bg-accent-dark [transform:translateZ(100px)]">
          <Zap className="mr-2 inline-block size-3.5 fill-current" />
          Ver detalhes
        </span>
      </div>
    </div>
  );

  return (
    <Link
      href={`/imoveis/${property.id}`}
      className="block h-full"
      onClick={(e) => {
        // Sem hover (toque), o primeiro toque só vira o card; o segundo abre o imóvel.
        if (!flipped && window.matchMedia('(hover: none)').matches) {
          e.preventDefault();
          setFlipped(true);
        }
      }}
    >
      <PerspectiveFlipCard front={front} back={back} flipped={flipped} w="w-full" h="h-[500px]" />
    </Link>
  );
}
