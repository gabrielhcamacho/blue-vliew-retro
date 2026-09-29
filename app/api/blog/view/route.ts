import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.REHUT_API_BASE_URL!;
const TOKEN = process.env.REHUT_API_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });

    await fetch(`${BASE_URL}/increment-blog-view?token=${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: id }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
