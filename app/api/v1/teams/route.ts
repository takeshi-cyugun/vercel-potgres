import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  console.log('[GET]/teams')
  const rows = await sql`SELECT * FROM teams;`;
  // console.log('rows: ', rows);
  return NextResponse.json( rows.rows , { status: 200 });
}
