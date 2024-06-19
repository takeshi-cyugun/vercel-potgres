import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  console.log('[GET]/teams')
  const { rows, rowCount } = await sql`SELECT * FROM teams;`;
  // console.log('rows: ', rows);
  return NextResponse.json( rows , { status: 200 });
}
