import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BedDouble, Bath, Car, Maximize, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
import { fetchPropertyById, fetchProperties, fetchSiteConfig } from '@/app/lib/rehut-api';
import {
  formatArea,
  propertyTypeLabel,
  purposeLabel,
} from '@/app/lib/utils';
import PropertyCard from '@/app/components/PropertyCard';
import PropertyGallery from '@/app/components/PropertyGallery';
import PropertyContactCard from '@/app/components/PropertyContactCard';

interface Props {
  params: Promise<{ id: string }>;
}

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

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const [configData, propData] = await Promise.all([
    fetchSiteConfig(),
    fetchPropertyById(id),
  ]);

  const property = propData.data[0];
  if (!property) notFound();

  const similar = await fetchProperties({
    property_type: property.property_type,
    purpose: property.purpose,
    page: '1',
  });
  const similarList = similar.data.filter((p) => p.id !== id).slice(0, 3);

  const price = property.purpose === 'aluguel' ? property.rental_price : property.price;

  const mapsLink =
    property.latitude && property.longitude
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : null;

  return (
    <div className="bg-night min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-azure mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: gallery + details */}
          <div className="lg:col-span-2 space-y-6">
            <PropertyGallery images={property.images || []} title={property.title} />

            {/* Info */}
            <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded font-medium text-white" style={{ backgroundColor: '#1f4fd1' }}>
                  {purposeLabel(property.purpose)}
                </span>
                <span className="text-xs px-2 py-1 rounded font-medium bg-white/5 text-white/80">
                  {propertyTypeLabel(property.property_type)}
                </span>
                {property.accepts_barter && (
                  <span className="text-xs px-2 py-1 rounded font-medium bg-amber-400/20 text-amber-300">
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    Aceita permuta
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold text-white">{property.title}</h1>

              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {[property.address, property.address_number, property.neighborhood, `${property.city}/${property.state}`]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <BedDouble className="w-5 h-5 mx-auto mb-1 text-azure" />
                    <p className="text-lg font-bold text-white">{property.bedrooms}</p>
                    <p className="text-xs text-white/60">{property.bedrooms === 1 ? 'Quarto' : 'Quartos'}</p>
                  </div>
                )}
                {property.suites > 0 && (
                  <div className="text-center">
                    <BedDouble className="w-5 h-5 mx-auto mb-1 text-azure" />
                    <p className="text-lg font-bold text-white">{property.suites}</p>
                    <p className="text-xs text-white/60">{property.suites === 1 ? 'Suíte' : 'Suítes'}</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <Bath className="w-5 h-5 mx-auto mb-1 text-azure" />
                    <p className="text-lg font-bold text-white">{property.bathrooms}</p>
                    <p className="text-xs text-white/60">{property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}</p>
                  </div>
                )}
                {property.parking_spots > 0 && (
                  <div className="text-center">
                    <Car className="w-5 h-5 mx-auto mb-1 text-azure" />
                    <p className="text-lg font-bold text-white">{property.parking_spots}</p>
                    <p className="text-xs text-white/60">{property.parking_spots === 1 ? 'Vaga' : 'Vagas'}</p>
                  </div>
                )}
                {(property.area_private || property.area_total) && (
                  <div className="text-center">
                    <Maximize className="w-5 h-5 mx-auto mb-1 text-azure" />
                    <p className="text-lg font-bold text-white">
                      {formatArea(property.area_private || property.area_total)}
                    </p>
                    <p className="text-xs text-white/60">Área</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="font-semibold text-white mb-2">Descrição</h2>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Barter */}
              {property.accepts_barter && property.barter_description && (
                <div className="p-4 rounded-lg bg-amber-400/10 border border-amber-400/20">
                  <p className="text-sm font-semibold text-amber-200 mb-1 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4" /> Aceita permuta
                  </p>
                  <p className="text-sm text-amber-300">{property.barter_description}</p>
                </div>
              )}

              {/* Map link */}
              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: '#76d3f6' }}
                >
                  <MapPin className="w-4 h-4" />
                  Ver no Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Right: contact card (sticky) */}
          <div className="lg:col-span-1">
            <PropertyContactCard property={property} whatsapp={configData.whatsapp} />
          </div>
        </div>

        {/* Similar properties */}
        {similarList.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Imóveis Similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
