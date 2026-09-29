'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { isExternalImage } from '@/app/lib/utils';

interface Props {
  images: string[];
}

export default function HeroSlideshow({ images }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Litoral catarinense"
          fill
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
          unoptimized={isExternalImage(src)}
        />
      ))}
    </>
  );
}
