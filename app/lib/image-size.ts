/**
 * Dimensões de fotos remotas lidas só do cabeçalho do arquivo (primeiros 64 KB).
 *
 * A galeria do imóvel precisa saber quais fotos são horizontais para escolher a capa e montar
 * o mosaico sem esperar o navegador carregar tudo. A API não informa largura e altura, então
 * lemos o cabeçalho JPEG/PNG/WebP. Qualquer falha devolve `null` e a galeria segue a ordem
 * original do cadastro.
 */

export interface ImageSize {
  width: number;
  height: number;
}

const HEAD_BYTES = 65536;

function readU16(b: Uint8Array, i: number, little = false) {
  return little ? b[i] | (b[i + 1] << 8) : (b[i] << 8) | b[i + 1];
}

function readU32(b: Uint8Array, i: number, little = false) {
  return little
    ? (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0
    : ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
}

/** Orientação EXIF (1–8) dentro de um segmento APP1; 5–8 giram a foto em 90°. */
function exifOrientation(b: Uint8Array, start: number, end: number): number {
  // "Exif\0\0"
  if (b[start] !== 0x45 || b[start + 1] !== 0x78 || b[start + 2] !== 0x69 || b[start + 3] !== 0x66) return 1;
  const tiff = start + 6;
  if (tiff + 8 > end) return 1;
  const little = b[tiff] === 0x49;
  const ifd = tiff + readU32(b, tiff + 4, little);
  if (ifd + 2 > end) return 1;
  const entries = readU16(b, ifd, little);
  for (let e = 0; e < entries; e++) {
    const at = ifd + 2 + e * 12;
    if (at + 12 > end) break;
    if (readU16(b, at, little) === 0x0112) return readU16(b, at + 8, little);
  }
  return 1;
}

function jpegSize(b: Uint8Array): ImageSize | null {
  let i = 2;
  let orientation = 1;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = b[i + 1];
    if (marker === 0xff) {
      i++;
      continue;
    }
    const len = readU16(b, i + 2);
    if (marker === 0xe1) orientation = exifOrientation(b, i + 4, Math.min(b.length, i + 2 + len));
    // SOF0–SOF15, exceto DHT (C4), JPG (C8) e DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = readU16(b, i + 5);
      const width = readU16(b, i + 7);
      return orientation >= 5 ? { width: height, height: width } : { width, height };
    }
    i += 2 + len;
  }
  return null;
}

function pngSize(b: Uint8Array): ImageSize | null {
  if (b.length < 24) return null;
  return { width: readU32(b, 16), height: readU32(b, 20) };
}

function webpSize(b: Uint8Array): ImageSize | null {
  const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
  if (chunk === 'VP8X') return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
  if (chunk === 'VP8 ') return { width: readU16(b, 26, true) & 0x3fff, height: readU16(b, 28, true) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = readU32(b, 21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function parseImageSize(b: Uint8Array): ImageSize | null {
  if (b.length < 30) return null;
  if (b[0] === 0xff && b[1] === 0xd8) return jpegSize(b);
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return pngSize(b);
  if (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45) return webpSize(b);
  return null;
}

export async function probeImageSize(url: string): Promise<ImageSize | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: `bytes=0-${HEAD_BYTES - 1}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const size = parseImageSize(new Uint8Array(await res.arrayBuffer()).subarray(0, HEAD_BYTES));
    return size && size.width > 0 && size.height > 0 ? size : null;
  } catch {
    return null;
  }
}
