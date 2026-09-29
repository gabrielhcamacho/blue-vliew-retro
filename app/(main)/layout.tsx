import { fetchSiteConfig } from '@/app/lib/rehut-api';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import WhatsAppFloatButton from '@/app/components/WhatsAppFloatButton';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const config = await fetchSiteConfig();

  return (
    <>
      <Header config={config} />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} />
      <WhatsAppFloatButton whatsapp={config.whatsapp} />
    </>
  );
}
