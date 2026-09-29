'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

// Mesmo mapa do Rehut (components/properties/PropertyMap.tsx): Carto Positron, zoom 15,
// alfinete na cor da marca, zoom só pelos botões e popup com título e endereço.
const STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const PIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>';

function webglSupported() {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
}

export default function PropertyMap({ latitude, longitude, title, address }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!webglSupported()) {
      setSupported(false);
      return;
    }

    let map: MapLibreMap | null = null;
    let cancelled = false;

    // A biblioteca só é baixada quando o mapa chega perto da tela.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const maplibre = (await import('maplibre-gl')).default;
        if (cancelled) return;

        map = new maplibre.Map({
          container: el,
          style: STYLE,
          center: [longitude, latitude],
          zoom: 15,
          scrollZoom: false,
          attributionControl: { compact: true },
        });

        map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'bottom-right');

        const pin = document.createElement('button');
        pin.type = 'button';
        pin.setAttribute('aria-label', `Ver endereço de ${title}`);
        pin.className =
          'block text-primary drop-shadow-md transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none motion-reduce:transition-none';
        pin.innerHTML = PIN_SVG;

        // textContent evita interpretar como HTML o que vem do cadastro.
        const content = document.createElement('div');
        content.className = 'text-sm p-1 pt-3';
        const strong = document.createElement('strong');
        strong.className = 'block mb-1 pt-1 text-slate-900';
        strong.textContent = title;
        const span = document.createElement('span');
        span.className = 'block leading-tight text-slate-600';
        span.textContent = address;
        content.append(strong, span);

        const popup = new maplibre.Popup({ anchor: 'bottom', offset: [0, -38], closeOnClick: false, maxWidth: '300px' }).setDOMContent(
          content,
        );

        new maplibre.Marker({ element: pin, anchor: 'bottom' }).setLngLat([longitude, latitude]).setPopup(popup).addTo(map);
      },
      { rootMargin: '300px' },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, [latitude, longitude, title, address]);

  if (!supported) {
    return (
      <div className="mt-6 grid h-64 place-items-center rounded-2xl bg-slate-100 p-6 text-center text-slate-800" role="status">
        <div>
          <MapPin className="mx-auto mb-2 h-7 w-7 fill-primary text-white" aria-hidden />
          <strong className="block text-sm">Mapa indisponível neste navegador</strong>
          <span className="mt-1 block text-xs text-slate-600">{address}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 h-72 overflow-hidden rounded-2xl border border-white/10 bg-[#f2f2f0] sm:h-80">
      {/* Altura explícita: o CSS do MapLibre força position:relative no contêiner do mapa. */}
      <div ref={box} className="h-full w-full" role="region" aria-label={`Mapa com a localização de ${title}`} />
    </div>
  );
}
