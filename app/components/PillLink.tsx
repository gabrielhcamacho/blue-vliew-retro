import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PillLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Abre em nova aba (WhatsApp e outros links externos). */
  external?: boolean;
}

/** Botão laranja em pílula com a seta num círculo escuro, igual ao CTA do hero da home. */
export default function PillLink({ href, children, className, external }: PillLinkProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full bg-accent py-1 pl-5 pr-1 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure motion-reduce:transition-none',
        className,
      )}
    >
      {children}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night transition-transform group-hover:scale-110 motion-reduce:transition-none">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
