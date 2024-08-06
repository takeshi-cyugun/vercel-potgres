import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
 
  const { rows, rowCount } = await sql`
    select 
      id
    , url
    , title
    , detail
    from contents
      where category = ${category}
    order by sort, created_at
  `;

  return NextResponse.json( rows , { status: 200 });
}
