import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, Viewport } from 'next';
import { ArrowLeft, ArrowUpRight, ChevronDown, MapPin } from 'lucide-react';
import { fetchPropertyById, fetchProperties, fetchSiteConfig } from '@/app/lib/rehut-api';
import { formatArea, formatCurrency, propertyTypeLabel, purposeLabel } from '@/app/lib/utils';
import { probeImageSize } from '@/app/lib/image-size';
import { STAGES, formatCoord, groupFeatures, propertyStage, splitDescription } from '@/app/lib/property-details';
import type { Property } from '@/app/lib/types';
import PropertyCard from '@/app/components/PropertyCard';
import PropertyGallery, { type GalleryPhoto } from '@/app/components/PropertyGallery';
import PropertyContactCard from '@/app/components/PropertyContactCard';
import PropertyActions from '@/app/components/PropertyActions';
import PropertyMap from '@/app/components/PropertyMap';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

// A barra fixa do mobile usa a área segura (env(safe-area-inset-bottom)).
export const viewport: Viewport = { viewportFit: 'cover' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchPropertyById(id);
  const property = data.data[0];
  if (!property) return {};
  return {
    title: property.title,
    description: property.description?.slice(0, 160),
  };
}

/**
 * Lê as dimensões das fotos e põe na frente a primeira horizontal, para a capa do mosaico.
 * A ordem cadastrada não muda: as demais seguem na sequência original.
 */
async function galleryPhotos(images: string[]): Promise<GalleryPhoto[]> {
  const sizes = await Promise.all(images.map(probeImageSize));
  const photos = images.map((src, i) => ({ src, ...(sizes[i] ?? {}) }));
  const cover = photos.findIndex((p) => p.width && p.height && p.width / p.height >= 1.2);
  if (cover <= 0) return photos;
  return [photos[cover], ...photos.slice(0, cover), ...photos.slice(cover + 1)];
}

const areaFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function specs(p: Property) {
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  const area = p.area_private || p.area_total;
  return [
    area ? { value: area > 10000 ? formatArea(area) : `${areaFmt.format(area)} m²`, label: p.area_private ? 'Área privativa' : 'Área total' } : null,
    p.bedrooms > 0 ? { value: String(p.bedrooms), label: plural(p.bedrooms, 'Quarto', 'Quartos') } : null,
    p.suites > 0 ? { value: String(p.suites), label: plural(p.suites, 'Suíte', 'Suítes') } : null,
    p.bathrooms > 0 ? { value: String(p.bathrooms), label: plural(p.bathrooms, 'Banheiro', 'Banheiros') } : null,
    p.parking_spots > 0 ? { value: String(p.parking_spots), label: plural(p.parking_spots, 'Vaga', 'Vagas') } : null,
  ].filter((s): s is { value: string; label: string } => s !== null);
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const [configData, propData] = await Promise.all([fetchSiteConfig(), fetchPropertyById(id)]);

  const property = propData.data[0];
  if (!property) notFound();

  const [similar, photos] = await Promise.all([
    fetchProperties({ property_type: property.property_type, purpose: property.purpose, page: '1' }),
    galleryPhotos(property.images || []),
  ]);
  const similarList = similar.data.filter((p) => p.id !== id).slice(0, 3);

  const features = groupFeatures(property);
  const description = splitDescription(property.description);
  const stage = propertyStage(property.property_situation);
  const specList = specs(property);
  const typeLabel = property.property_type ? propertyTypeLabel(property.property_type) : '';
  const place = [property.neighborhood, [property.city, property.state].filter(Boolean).join('/')].filter(Boolean).join(', ');
  const hasCoords = typeof property.latitude === 'number' && typeof property.longitude === 'number';
  const mapsLink = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
    : place
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.neighborhood, property.city, property.state].filter(Boolean).join(', '))}`
      : null;

  const sections: { id: string; title: string; body: React.ReactNode }[] = [];

  if (description) {
    sections.push({
      id: 'sobre',
      title: 'Sobre o imóvel',
      body: <p className="max-w-2xl text-lg leading-relaxed text-white/80">{description.intro}</p>,
    });
  }
  if (features.unit.length) {
    sections.push({ id: 'unidade', title: 'Diferenciais da unidade', body: <FeatureList items={features.unit} /> });
  }
  if (features.building.length) {
    sections.push({ id: 'empreendimento', title: 'Estrutura do empreendimento', body: <FeatureList items={features.building} /> });
  }
  if (features.security.length) {
    sections.push({ id: 'seguranca', title: 'Segurança e conveniência', body: <FeatureList items={features.security} /> });
  }
  if (description && description.rest.length) {
    sections.push({
      id: 'descricao',
      title: 'Descrição completa',
      body: (
        <details className="group max-w-2xl">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Ler descrição completa</span>
            <span className="hidden group-open:inline">Recolher descrição</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <div className="photo-in mt-5 space-y-4 text-[15px] leading-relaxed text-white/70">
            {[description.intro, ...description.rest].map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        </details>
      ),
    });
  }
  if (property.accepts_barter && property.barter_description) {
    sections.push({
      id: 'permuta',
      title: 'Aceita permuta',
      body: (
        <p className="max-w-2xl leading-relaxed text-white/75">
          {property.barter_description}
        </p>
      ),
    });
  }
  if (property.condominium || property.iptu) {
    sections.push({
      id: 'custos',
      title: 'Custos mensais',
      body: (
        <dl className="grid max-w-md divide-y divide-white/10 border-y border-white/10">
          {property.condominium ? <CostRow label="Condomínio" value={property.condominium} /> : null}
          {property.iptu ? <CostRow label="IPTU" value={property.iptu} /> : null}
        </dl>
      ),
    });
  }
  if (stage) {
    const current = STAGES.findIndex((s) => s.id === stage);
    sections.push({
      id: 'obra',
      title: 'Estágio da obra',
      body: (
        <ol className="grid max-w-2xl grid-cols-3 gap-2">
          {STAGES.map((s, i) => (
            <li key={s.id} aria-current={i === current ? 'step' : undefined}>
              <div className={cn('h-0.5 rounded-full', i <= current ? 'bg-azure' : 'bg-white/10', i === current && 'bg-accent')} />
              <p className={cn('mt-3 text-sm', i === current ? 'font-medium text-white' : i < current ? 'text-white/60' : 'text-white/40')}>
                {s.label}
              </p>
              {i === current && <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Agora</p>}
            </li>
          ))}
        </ol>
      ),
    });
  }
  if (place) {
    sections.push({
      id: 'localizacao',
      title: 'Localização',
      body: (
        <div className="max-w-3xl">
          <div className="flex flex-col gap-5 border-l border-azure/30 pl-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-white">{property.neighborhood || property.city}</p>
              <p className="mt-1 text-white/65">{[property.city, property.state].filter(Boolean).join(' · ')}</p>
              {hasCoords && (
                <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-azure/80">
                  {formatCoord(property.latitude!, 'lat')} · {formatCoord(property.longitude!, 'lng')}
                </p>
              )}
            </div>
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm text-azure underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure sm:self-auto"
              >
                {hasCoords ? 'Abrir no Google Maps' : 'Ver a região no mapa'}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
          {hasCoords && (
            <PropertyMap latitude={property.latitude!} longitude={property.longitude!} title={property.title} address={place} />
          )}
        </div>
      ),
    });
  }

  const published = property.created_at ? new Date(property.created_at) : null;
  const updated = property.updated_at ? new Date(property.updated_at) : null;

  return (
    <div className="min-h-screen bg-night pt-20">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-1.5 rounded text-sm text-white/60 transition-colors hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para imóveis
        </Link>

        {/* Primeira dobra: identificação do imóvel */}
        <header className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em]">
              <span className="text-azure">{purposeLabel(property.purpose)}</span>
              {typeLabel && (
                <>
                  <span aria-hidden className="h-3 w-px bg-white/20" />
                  <span className="text-white/70">{typeLabel}</span>
                </>
              )}
              {property.property_code && (
                <>
                  <span aria-hidden className="h-3 w-px bg-white/20" />
                  <span className="text-white/55">Cód. {property.property_code}</span>
                </>
              )}
              {property.accepts_barter && (
                <>
                  <span aria-hidden className="h-3 w-px bg-white/20" />
                  <span className="text-accent">Aceita permuta</span>
                </>
              )}
            </div>
            <h1 className="mt-3 max-w-4xl text-balance break-words font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>
            {place && (
              <p className="mt-3 flex items-center gap-1.5 text-white/65">
                <MapPin className="h-4 w-4 shrink-0 text-azure" />
                {place}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <PropertyActions id={property.id} title={property.title} />
          </div>
        </header>

        <div className="mt-6 lg:mt-8">
          <PropertyGallery photos={photos} title={property.title} />
        </div>

        {/* Números principais, só os que vieram preenchidos */}
        {specList.length > 0 && (
          <ul className="mt-6 grid grid-cols-3 gap-y-5 border-b border-white/10 pb-6 sm:flex sm:flex-wrap lg:mt-8">
            {specList.map((s, i) => (
              <li
                key={s.label}
                className={cn('border-l border-white/10 pl-3 sm:pl-8 sm:pr-8', i === 0 && 'sm:border-l-0 sm:pl-0')}
              >
                <p className="whitespace-nowrap font-display text-2xl font-semibold tabular-nums text-white sm:text-3xl">{s.value}</p>
                <p className="mt-0.5 whitespace-nowrap text-xs text-white/55">{s.label}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                aria-labelledby={`sec-${s.id}`}
                className={cn('grid gap-4 py-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8', i === 0 ? 'pt-0' : 'border-t border-white/10')}
              >
                <h2 id={`sec-${s.id}`} className="font-display text-base font-semibold text-white">
                  <span className="mb-1 block font-mono text-[10px] font-normal tracking-[0.25em] text-azure/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </h2>
                <div className="min-w-0">{s.body}</div>
              </section>
            ))}

            {/* Metadados discretos */}
            <p className="mt-4 border-t border-dashed border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {[
                property.property_code ? `Cód. ${property.property_code}` : null,
                published && !Number.isNaN(published.getTime()) ? `Publicado em ${dateFmt.format(published)}` : null,
                updated && !Number.isNaN(updated.getTime()) && published && updated.toDateString() !== published.toDateString()
                  ? `Atualizado em ${dateFmt.format(updated)}`
                  : null,
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </p>
          </div>

          <div>
            <PropertyContactCard property={property} whatsapp={configData.whatsapp} />
          </div>
        </div>

        {similarList.length > 0 && (
          <section aria-labelledby="similares" className="mt-16 border-t border-white/10 pt-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-azure">Continue explorando</p>
                <h2 id="similares" className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Imóveis similares
                </h2>
              </div>
              <Link
                href="/imoveis"
                className="hidden shrink-0 items-center gap-1.5 text-sm text-white/70 hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure sm:inline-flex"
              >
                Ver todos
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarList.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 border-b border-white/[0.06] py-2.5 text-[15px] text-white/80">
          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-azure/70" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-white/65">{label}</dt>
      <dd className="tabular-nums text-white">
        {formatCurrency(value)}
        <span className="text-white/50">/mês</span>
      </dd>
    </div>
  );
}
