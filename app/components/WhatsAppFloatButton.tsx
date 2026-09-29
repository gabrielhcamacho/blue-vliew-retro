import { whatsappUrl } from '@/app/lib/utils';

interface Props {
  whatsapp?: string;
}

export default function WhatsAppFloatButton({ whatsapp }: Props) {
  if (!whatsapp) return null;

  return (
    <a
      href={whatsappUrl(whatsapp, 'Olá, estava navegando em seu site e gostaria de mais informações.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
      style={{ backgroundColor: '#25D366', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}
    >
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#ffffff">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 004.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-10-10.01-10zm0 18.15h-.01a8.1 8.1 0 01-4.14-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.14 8.14 0 01-1.25-4.31c0-4.49 3.66-8.15 8.16-8.15 2.18 0 4.22.85 5.76 2.39a8.09 8.09 0 012.39 5.77c0 4.49-3.66 8.14-8.13 8.14zm4.47-6.1c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14-.01-.3-.01-.46-.01a.9.9 0 00-.65.3c-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.46-.29z" />
      </svg>
    </a>
  );
}
