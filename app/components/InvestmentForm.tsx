'use client';

import { useState } from 'react';
import { submitLeadAction, type InvestorLeadData } from '@/app/actions/submit-lead';

const investmentRanges = [
  'Até R$ 500 mil',
  'R$ 500 mil a R$ 1 mi',
  'R$ 1 mi a R$ 1,5 mi',
  'R$ 1,5 mi a R$ 3 mi',
  'R$ 3 mi a R$ 5 mi',
  'R$ 5 mi a R$ 10 mi',
  'Acima de R$ 10 mi',
];

const investorProfiles = [
  'Compra própria (moradia)',
  'Investimento para renda (aluguel)',
  'Valorização de capital',
  'Diversificação de portfólio',
];

const brazilStates = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function InvestmentForm() {
  const [form, setForm] = useState<InvestorLeadData>({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    investment_range: '',
    investor_profile: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const set = (field: keyof InvestorLeadData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');
    const result = await submitLeadAction({ ...form, interest_type: 'investimento' });
    setStatus(result.success ? 'success' : 'error');
    if (result.success) setForm({
      name: '', phone: '', email: '', cpf: '', address: '',
      city: '', state: '', investment_range: '', investor_profile: '', message: '',
    });
  };

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-white text-2xl font-bold"
          style={{ backgroundColor: '#1f4fd1' }}
        >
          ✓
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Cadastro realizado!</h3>
        <p className="text-white/60">
          Em breve nossa equipe de investimentos entrará em contato com oportunidades
          selecionadas especialmente para o seu perfil.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dados pessoais */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-white/80 mb-2 block">
          Dados Pessoais
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Nome completo *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={set('cpf')}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Telefone / WhatsApp *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={set('phone')}
              placeholder="(47) 99999-9999"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
            />
          </div>
        </div>
      </fieldset>

      {/* Endereço */}
      <fieldset className="space-y-4 border-t border-border pt-4">
        <legend className="text-sm font-semibold text-white/80 mb-2 block">
          Localização
        </legend>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Endereço</label>
          <input
            type="text"
            value={form.address}
            onChange={set('address')}
            placeholder="Rua, número, bairro"
            className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Cidade</label>
            <input
              type="text"
              value={form.city}
              onChange={set('city')}
              placeholder="Sua cidade"
              className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Estado</label>
            <select
              value={form.state}
              onChange={set('state')}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-1 focus:ring-azure"
            >
              <option value="">UF</option>
              {brazilStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Perfil de investimento */}
      <fieldset className="space-y-4 border-t border-border pt-4">
        <legend className="text-sm font-semibold text-white/80 mb-2 block">
          Perfil de Investimento
        </legend>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Faixa de investimento disponível
          </label>
          <select
            value={form.investment_range}
            onChange={set('investment_range')}
            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-1 focus:ring-azure"
          >
            <option value="">Selecione a faixa</option>
            {investmentRanges.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Objetivo do investimento
          </label>
          <select
            value={form.investor_profile}
            onChange={set('investor_profile')}
            className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-1 focus:ring-azure"
          >
            <option value="">Selecione o objetivo</option>
            {investorProfiles.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Mensagem (opcional)
          </label>
          <textarea
            value={form.message}
            onChange={set('message')}
            placeholder="Ex: Busco apartamento frente mar entre R$ 2 mi e R$ 5 mi para renda de temporada."
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-azure resize-none"
          />
        </div>
      </fieldset>

      {status === 'error' && (
        <p className="text-sm text-red-400">
          Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 px-6 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: '#ff751f' }}
      >
        {status === 'loading' ? 'Enviando...' : 'Quero receber oportunidades'}
      </button>

      <p className="text-xs text-white/45 text-center">
        Seus dados são confidenciais e utilizados apenas para o contato da nossa equipe.
      </p>
    </form>
  );
}
