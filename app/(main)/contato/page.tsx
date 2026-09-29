import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { fetchSiteConfig } from '@/app/lib/rehut-api';
import { whatsappUrl } from '@/app/lib/utils';
import PageHero from '@/app/components/PageHero';

export const metadata: Metadata = {
  title: 'Contato | Blueview Imóveis',
  description: 'Fale com os especialistas da Blueview Imóveis. Atendimento de segunda à domingo, das 8h às 19h.',
};

export default async function ContatoPage() {
  const config = await fetchSiteConfig();

  const waLink = config.whatsapp
    ? whatsappUrl(config.whatsapp, 'Olá! Gostaria de mais informações sobre imóveis.')
    : '#';

  return (
    <div className="bg-night min-h-screen pb-14">
      <PageHero
        compact
        eyebrow="[ Contato ] Fale com um corretor"
        title="Vamos conversar"
        description="Reunimos um time de especialistas preparados para auxiliar em tudo que você precisar."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contato cards */}
          <div className="space-y-4">
            {config.whatsapp && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border border-border hover:border-azure transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(118,211,246,0.1)' }}
                >
                  <MessageCircle className="w-6 h-6" style={{ color: '#76d3f6' }} />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-[#0f0392] transition-colors">
                    WhatsApp
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">{config.whatsapp}</p>
                  <p className="text-xs text-white/45 mt-1">Clique para abrir o WhatsApp</p>
                </div>
              </a>
            )}

            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border border-border hover:border-azure transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(118,211,246,0.1)' }}
                >
                  <Phone className="w-6 h-6" style={{ color: '#76d3f6' }} />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-[#0f0392] transition-colors">
                    Telefone
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">{config.phone}</p>
                </div>
              </a>
            )}

            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border border-border hover:border-azure transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(118,211,246,0.1)' }}
                >
                  <Mail className="w-6 h-6" style={{ color: '#76d3f6' }} />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-[#0f0392] transition-colors">
                    E-mail
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">{config.email}</p>
                </div>
              </a>
            )}

            {config.branches?.map((branch) => (
              <div
                key={branch.label}
                className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border border-border"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(118,211,246,0.1)' }}
                >
                  <MapPin className="w-6 h-6" style={{ color: '#76d3f6' }} />
                </div>
                <div>
                  <p className="font-semibold text-white">{branch.label}</p>
                  <p className="text-white/60 text-sm mt-0.5">{branch.address}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-sm border border-border">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(118,211,246,0.1)' }}
              >
                <Clock className="w-6 h-6" style={{ color: '#76d3f6' }} />
              </div>
              <div>
                <p className="font-semibold text-white">Horário de atendimento</p>
                <p className="text-white/60 text-sm mt-0.5">Segunda à domingo, das 8h às 19h</p>
              </div>
            </div>
          </div>

          {/* CTA panel */}
          <div
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-night-soft to-primary p-8 text-white flex flex-col justify-between"
          >
            <div className="scanlines pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-accent/30 blur-[80px]" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4">Encontre o imóvel ideal</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                Especializada em imóveis de médio e alto padrão em Itapema, Porto Belo,
                Balneário Camboriú e Praia Brava. Do primeiro contato à escritura, nossa
                equipe acompanha cada etapa.
              </p>
            </div>
            <div className="relative space-y-3">
              {config.whatsapp && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar pelo WhatsApp
                </a>
              )}
              <Link
                href="/imoveis"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border-2 border-white/40 text-white transition-colors hover:bg-white/10"
              >
                Ver imóveis disponíveis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
