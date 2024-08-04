import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: number } }) {
  console.log('[GET]/players/[id]')
  const result = ''
  return NextResponse.json(result, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { id: number } }) {
  console.log('[PUT]/players/[id]')
  const id = params.id;

  const reqBody = await request.json();
  const level: string | null = (reqBody.level) ? reqBody.level : null
  const strong_weak: string | null = (reqBody.strong_weak) ? reqBody.strong_weak : null
  const ai_advice: string | null = (reqBody.ai_advice) ? reqBody.ai_advice : null

  if (!id) return new NextResponse("Player ID is required", { status: 400 });


  try {
    await sql`
    UPDATE players 
    SET level = ${level} 
      , strong_weak = ${strong_weak} 
      , ai_advice = ${ai_advice}
    WHERE id = ${id};`;
    return NextResponse.json({ result: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
