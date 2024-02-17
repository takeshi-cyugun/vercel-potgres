import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season');
  const result = (season) ? await sql`SELECT * FROM events where season = ${season};` : await sql`SELECT * FROM events;`
  return NextResponse.json( result.rows , { status: 200 });
}
