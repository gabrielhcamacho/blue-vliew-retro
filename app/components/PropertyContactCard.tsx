'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, CalendarDays, CheckCircle2, Loader2, MessageCircle, X } from 'lucide-react';
import { submitLeadAction } from '@/app/actions/submit-lead';
import { formatCurrency, whatsappUrl } from '@/app/lib/utils';
import { useModal } from '@/app/hooks/useModal';
import { cn } from '@/lib/utils';

interface PropertyInfo {
  id: string;
  title: string;
  property_code?: string;
  price: number | null;
  rental_price: number | null;
  purpose: string;
  condominium: number | null;
  iptu: number | null;
}

interface Props {
  property: PropertyInfo;
  /** WhatsApp da imobiliária (vem do CRM). Sem ele, o lead é registrado sem abrir a conversa. */
  whatsapp?: string;
}

type Intent = 'interesse' | 'visita';
type State = 'form' | 'loading' | 'done';

const PERIODS = ['Sem preferência', 'Manhã', 'Tarde'] as const;

/**
 * Contato do imóvel: painel lateral fixo no desktop, barra compacta no mobile e um único
 * formulário (em diálogo) para "Tenho interesse" e "Agendar visita". O fluxo continua o mesmo
 * de antes: registra o lead no CRM e abre o WhatsApp com nome, código e link do imóvel.
 */
export default function PropertyContactCard({ property, whatsapp }: Props) {
  const [intent, setIntent] = useState<Intent | null>(null);
  const rent = property.purpose === 'aluguel';
  const price = rent ? property.rental_price : property.price;
  const close = useCallback(() => setIntent(null), []);

  const priceLabel = rent ? 'Aluguel mensal' : 'Valor de venda';

  return (
    <>
      {/* Desktop: painel lateral que acompanha a leitura */}
      <aside aria-label="Contato sobre o imóvel" className="sticky top-28 hidden lg:block">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night-soft/60 p-6 backdrop-blur-sm">
          <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-azure/0 via-azure/60 to-accent/0" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-azure">{priceLabel}</p>
          <Price value={price} rent={rent} className="mt-2 text-[2rem]" />

          {property.condominium || property.iptu ? (
            <dl className="mt-5 divide-y divide-white/10 border-y border-white/10 text-sm">
              {property.condominium ? <Fee label="Condomínio" value={property.condominium} /> : null}
              {property.iptu ? <Fee label="IPTU" value={property.iptu} /> : null}
            </dl>
          ) : null}

          <div className="mt-6 space-y-2.5">
            <button type="button" onClick={() => setIntent('interesse')} className={primaryBtn}>
              <MessageCircle className="h-4 w-4" />
              Tenho interesse
            </button>
            <button type="button" onClick={() => setIntent('visita')} className={secondaryBtn}>
              <CalendarDays className="h-4 w-4" />
              Agendar visita
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/55">
            {whatsapp
              ? 'Você deixa nome e telefone e o WhatsApp abre com o imóvel já identificado.'
              : 'Você deixa nome e telefone e a equipe entra em contato.'}
          </p>

          {property.property_code && (
            <p className="mt-5 border-t border-dashed border-white/15 pt-4 font-mono text-[11px] tracking-[0.2em] text-white/60">
              CÓD. <span className="text-azure">{property.property_code}</span>
            </p>
          )}
        </div>
      </aside>

      {/* Mobile: barra compacta com preço e um único botão de contato */}
      <div
        data-property-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-azure">{priceLabel}</p>
            <Price value={price} rent={rent} className="text-lg leading-tight" />
          </div>
          <button type="button" onClick={() => setIntent('interesse')} className={cn(primaryBtn, 'w-auto shrink-0 px-5')}>
            <MessageCircle className="h-4 w-4" />
            Tenho interesse
          </button>
        </div>
      </div>

      {intent && <ContactDialog property={property} whatsapp={whatsapp} intent={intent} onIntent={setIntent} onClose={close} />}
    </>
  );
}

const primaryBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-night transition-colors hover:bg-[#ff8a40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure disabled:opacity-70';
const secondaryBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure';

function Price({ value, rent, className }: { value: number | null; rent: boolean; className?: string }) {
  if (!value) {
    return <p className={cn('font-display font-semibold text-white', className)}>Sob consulta</p>;
  }
  return (
    <p className={cn('font-display font-semibold tabular-nums tracking-tight text-white', className)}>
      {formatCurrency(value)}
      {rent && <span className="ml-1 text-sm font-normal text-white/60">/mês</span>}
    </p>
  );
}

function Fee({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-white/60">{label}</dt>
      <dd className="tabular-nums text-white">
        {formatCurrency(value)}
        <span className="text-white/50">/mês</span>
      </dd>
    </div>
  );
}

interface DialogProps extends Props {
  intent: Intent;
  onIntent: (i: Intent) => void;
  onClose: () => void;
}

function ContactDialog({ property, whatsapp, intent, onIntent, onClose }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [state, setState] = useState<State>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[0]);
  const [error, setError] = useState('');
  const [chatUrl, setChatUrl] = useState<string | null>(null);

  useModal(true, onClose, panel);

  // Trocar de intenção depois de enviado recomeça o formulário.
  useEffect(() => {
    setState((s) => (s === 'done' ? 'form' : s));
  }, [intent]);

  const propertyUrl = `https://blueviewimoveis.com.br/imoveis/${property.id}`;
  const code = property.property_code ? ` (${property.property_code})` : '';
  const visit = intent === 'visita';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Informe nome e telefone para continuar.');
      return;
    }
    setError('');
    setState('loading');

    const periodLine = visit && period !== PERIODS[0] ? `Período preferido: ${period}` : '';

    try {
      await submitLeadAction({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        property_id: property.id,
        interest_type: 'imovel',
        message: [
          `${visit ? 'Agendar visita ao imóvel' : 'Interesse no imóvel'}: ${property.title}${code}`,
          periodLine,
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch {
      // Mesmo se a API falhar, a conversa no WhatsApp segue.
    }

    const msg =
      (visit ? `Olá! Gostaria de agendar uma visita ao imóvel abaixo:\n\n` : `Olá! Tenho interesse no imóvel abaixo:\n\n`) +
      `*${property.title}*\n` +
      (property.property_code ? `Código: ${property.property_code}\n` : '') +
      `Link: ${propertyUrl}\n` +
      (periodLine ? `${periodLine}\n` : '') +
      `\nMeus dados:\n` +
      `Nome: ${name.trim()}\n` +
      `Telefone: ${phone.trim()}\n` +
      (email.trim() ? `E-mail: ${email.trim()}\n` : '');

    if (whatsapp) {
      const url = whatsappUrl(whatsapp, msg);
      setChatUrl(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setState('done');
  };

  const input =
    'w-full rounded-lg border border-white/15 bg-night/60 px-3.5 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-azure focus-visible:ring-2 focus-visible:ring-azure/40 disabled:opacity-60';

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center">
      <div aria-hidden onClick={onClose} className="photo-in absolute inset-0 bg-night/70 backdrop-blur-sm" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sheet-in relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-night-soft px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:px-7 lg:max-w-md lg:rounded-2xl lg:pb-7"
      >
        <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 lg:hidden" />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-azure">
              {property.property_code ? `Cód. ${property.property_code}` : 'Contato'}
            </p>
            <h2 id={titleId} className="mt-1 font-display text-xl font-semibold text-white">
              {visit ? 'Agendar visita' : 'Tenho interesse'}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-white/60">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-azure hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div role="radiogroup" aria-label="Tipo de contato" className="mt-5 grid grid-cols-2 rounded-full border border-white/10 p-1">
          {(['interesse', 'visita'] as const).map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={intent === i}
              onClick={() => onIntent(i)}
              className={cn(
                'rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure',
                intent === i ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white',
              )}
            >
              {i === 'visita' ? 'Agendar visita' : 'Tenho interesse'}
            </button>
          ))}
        </div>

        {state === 'done' ? (
          <div className="photo-in flex flex-col items-center gap-2 py-8 text-center" role="status">
            <CheckCircle2 className="h-9 w-9 text-azure" strokeWidth={1.5} />
            <p className="font-medium text-white">Dados enviados</p>
            <p className="max-w-xs text-sm text-white/60">
              {whatsapp
                ? 'Abrimos o WhatsApp com a mensagem pronta. Se ele não abriu, use o botão abaixo.'
                : 'A equipe da Blueview vai entrar em contato pelo telefone informado.'}
            </p>
            {chatUrl && (
              <a href={chatUrl} target="_blank" rel="noopener noreferrer" className={cn(primaryBtn, 'mt-3 w-auto')}>
                Abrir WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <button type="button" onClick={() => setState('form')} className="mt-2 text-xs text-white/55 underline underline-offset-4 hover:text-white">
              Editar dados
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Nome *</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-autofocus
                disabled={state === 'loading'}
                className={input}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">Telefone / WhatsApp *</span>
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={state === 'loading'}
                className={input}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/70">E-mail</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === 'loading'}
                className={input}
              />
            </label>

            {visit && (
              <fieldset>
                <legend className="mb-1.5 text-xs text-white/70">Melhor período</legend>
                <div className="flex flex-wrap gap-2">
                  {PERIODS.map((p) => (
                    <label
                      key={p}
                      className={cn(
                        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azure',
                        period === p ? 'border-azure text-azure' : 'border-white/15 text-white/70 hover:text-white',
                      )}
                    >
                      <input type="radio" name="period" value={p} checked={period === p} onChange={() => setPeriod(p)} className="sr-only" />
                      {p}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {error && (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            )}

            <button type="submit" disabled={state === 'loading'} className={cn(primaryBtn, 'mt-2')}>
              {state === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                  Enviando…
                </>
              ) : whatsapp ? (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Enviar e abrir WhatsApp
                </>
              ) : (
                'Enviar'
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
