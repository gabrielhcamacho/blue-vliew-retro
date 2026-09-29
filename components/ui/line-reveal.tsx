'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

interface LineRevealProps {
  /** Cada item vira uma linha do título, revelada de baixo para cima por trás de uma máscara. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Anima ao montar (heros) em vez de esperar entrar na tela. */
  onMount?: boolean;
}

export function LineReveal({ lines, className, lineClassName, delay = 0, onMount = false }: LineRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    // O gatilho de visibilidade fica no bloco inteiro: as linhas em si começam escondidas pela
    // máscara e nunca "entrariam" na tela sozinhas.
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      {...(onMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.4 } })}
    >
      {lines.map((line, i) => (
        // pb/-mb dão espaço aos descendentes (g, p, ç) sem mudar o entrelinhas
        <span key={i} className={cn('block overflow-hidden pb-[0.12em] -mb-[0.12em]', lineClassName)}>
          <motion.span
            className="block"
            variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: delay + i * 0.12, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
