import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season');
  const { rows, rowCount } = (season) ? await sql`SELECT * FROM events where season = ${season} ORDER BY ABS(current_date - event_date);` : await sql`SELECT * FROM events ORDER BY ABS(current_date - event_date);`
  return NextResponse.json( rows , { status: 200 });
}
