'use client';

import { useState } from 'react';
import { MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLeadAction } from '@/app/actions/submit-lead';
import { formatCurrency } from '@/app/lib/utils';
import { whatsappUrl } from '@/app/lib/utils';

interface PropertyInfo {
  id: string;
  title: string;
  property_code?: string;
  price: number | null;
  rental_price: number | null;
  purpose: string;
  condominium: number | null;
  iptu: number | null;
  created_at: string;
}

interface Props {
  property: PropertyInfo;
  /** WhatsApp da imobiliária (vem do CRM). Sem ele, o lead é registrado sem abrir a conversa. */
  whatsapp?: string;
}

type State = 'idle' | 'form' | 'loading' | 'done';

export default function PropertyContactCard({ property, whatsapp }: Props) {
  const [state, setState] = useState<State>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const price = property.purpose === 'aluguel' ? property.rental_price : property.price;
  const propertyUrl = `https://blueviewimoveis.com.br/imoveis/${property.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Nome e telefone são obrigatórios.');
      return;
    }
    setError('');
    setState('loading');

    try {
      await submitLeadAction({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        property_id: property.id,
        interest_type: 'imovel',
        message: `Interesse no imóvel: ${property.title}${property.property_code ? ` (${property.property_code})` : ''}`,
      });
    } catch {
      // Even if the API fails, still open WhatsApp
    }

    const msg =
      `Olá! Tenho interesse no imóvel abaixo:\n\n` +
      `*${property.title}*\n` +
      (property.property_code ? `Código: ${property.property_code}\n` : '') +
      `Link: ${propertyUrl}\n\n` +
      `Meus dados:\n` +
      `Nome: ${name.trim()}\n` +
      `Telefone: ${phone.trim()}\n` +
      (email.trim() ? `E-mail: ${email.trim()}\n` : '');

    if (whatsapp) window.open(whatsappUrl(whatsapp, msg), '_blank', 'noopener,noreferrer');
    setState('done');
  };

  return (
    <div className="sticky top-24 bg-card rounded-xl p-6 shadow-sm border border-border space-y-4">
      {/* Price */}
      <div>
        {price ? (
          <>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(price)}
              {property.purpose === 'aluguel' && (
                <span className="text-base font-normal text-white/60">/mês</span>
              )}
            </p>
            {property.condominium ? (
              <p className="text-sm text-white/60 mt-1">
                + {formatCurrency(property.condominium)} condomínio
              </p>
            ) : null}
            {property.iptu ? (
              <p className="text-sm text-white/60">
                + {formatCurrency(property.iptu)} IPTU/mês
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-xl font-bold text-white/60">Consulte o preço</p>
        )}
      </div>

      {/* Idle state: show button */}
      {state === 'idle' && (
        <button
          onClick={() => setState('form')}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#ff751f' }}
        >
          <MessageCircle className="w-5 h-5" />
          Tenho interesse pelo WhatsApp
        </button>
      )}

      {/* Form state */}
      {(state === 'form' || state === 'loading') && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm font-semibold text-white/80">Seus dados para contato</p>

          <input
            type="text"
            placeholder="Nome completo *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={state === 'loading'}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:border-azure disabled:opacity-60"
            style={{ '--tw-ring-color': '#76d3f6' } as React.CSSProperties}
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === 'loading'}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:border-azure disabled:opacity-60"
          />

          <input
            type="tel"
            placeholder="Telefone / WhatsApp *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={state === 'loading'}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:border-azure disabled:opacity-60"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: '#ff751f' }}
          >
            {state === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Enviar e falar no WhatsApp
              </>
            )}
          </button>
        </form>
      )}

      {/* Done state */}
      {state === 'done' && (
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <CheckCircle2 className="w-8 h-8" style={{ color: '#76d3f6' }} />
          <p className="text-sm font-semibold text-white/90">Dados enviados!</p>
          <p className="text-xs text-white/45">O WhatsApp foi aberto com uma mensagem pronta.</p>
          <button
            onClick={() => setState('idle')}
            className="mt-1 text-xs underline text-white/45 hover:text-white/70"
          >
            Enviar novamente
          </button>
        </div>
      )}

      <p className="text-xs text-white/45 text-center">Nossa equipe responde em instantes</p>

      <div className="pt-2 border-t border-border text-xs text-white/60 space-y-1">
        {property.property_code && <p>Código: {property.property_code}</p>}
        <p>Publicado em {new Date(property.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}
