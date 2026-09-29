import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const TOKEN = process.env.REHUT_API_TOKEN!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: cors });
}

export async function POST(req: NextRequest) {
  try {
    const { token, tag } = await req.json();

    if (!token || token !== TOKEN) {
      return NextResponse.json({ ok: false }, { status: 401, headers: cors });
    }

    revalidateTag(tag ?? 'blog', 'seconds');

    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500, headers: cors });
  }
}
