'use server';

const BASE_URL = process.env.REHUT_API_BASE_URL!;
const TOKEN = process.env.REHUT_API_TOKEN!;

export interface InvestorLeadData {
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  city?: string;
  state?: string;
  address?: string;
  investment_range?: string;
  investor_profile?: string;
  message?: string;
  property_id?: string;
  interest_type?: string;
}

export async function submitLeadAction(
  data: InvestorLeadData
): Promise<{ success: boolean; lead_id?: string; error?: string }> {
  const url = `${BASE_URL}/submit-website-lead?token=${TOKEN}`;

  // Compose detailed message for Rehut CRM
  const parts: string[] = [];
  if (data.cpf) parts.push(`CPF: ${data.cpf}`);
  if (data.city || data.state) parts.push(`Localização: ${[data.city, data.state].filter(Boolean).join('/')}`);
  if (data.address) parts.push(`Endereço: ${data.address}`);
  if (data.investment_range) parts.push(`Faixa de investimento: ${data.investment_range}`);
  if (data.investor_profile) parts.push(`Perfil: ${data.investor_profile}`);
  if (data.message) parts.push(`Mensagem: ${data.message}`);

  const fullMessage = parts.join('\n');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: fullMessage || undefined,
      property_id: data.property_id,
      interest_type: data.interest_type || 'investimento',
    }),
  });

  return res.json();
}
