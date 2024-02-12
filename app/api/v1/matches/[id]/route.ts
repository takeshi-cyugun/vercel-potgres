import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;
  if (!id) return new NextResponse("User ID is required", { status: 400 });

  const rows = await sql`
    SELECT 
      m.Teama_id          AS teamA_id
    , A.name              AS teamA_name
    , A.color_code        AS teamA_color_code
    , A.text_color_code   AS teamA_text_color_code
    , m.Teamb_id          AS teamB_id
    , B.name              AS teamB_name
    , B.color_code        AS teamB_color_code
    , B.text_color_code   AS teamB_text_color_code
    FROM matches m
    LEFT JOIN teams A
    ON m.Teama_id = A.id
    LEFT JOIN teams B
    ON m.Teamb_id = B.id
    WHERE m.id = ${id};`;
  
  const result = {
    A: {
      id: rows.rows[0].teama_id,
      name: rows.rows[0].teama_name,
      textColorCode: rows.rows[0].teama_text_color_code,
      colorCode: rows.rows[0].teama_color_code,
    },
    B: {
      id: rows.rows[0].teamb_id,
      name: rows.rows[0].teamb_name,
      textColorCode: rows.rows[0].teamb_text_color_code,
      colorCode: rows.rows[0].teamb_color_code,
    },
  }
  console.log('result', result)
  return NextResponse.json(result, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { id: number } }) {
  const id = params.id;

  const reqBody = await request.json();
  const win: string | null = (reqBody.win) ? reqBody.win : null
  const strategyA: string | null = (reqBody.strategyA) ? reqBody.strategyA : null
  const strategyB: string | null = (reqBody.strategyB) ? reqBody.strategyB : null

  if (!id) return new NextResponse("User ID is required", { status: 400 });
  if (!win) return new NextResponse("Win ID is required", { status: 400 });

  try {
    await sql`
    UPDATE matches 
    SET win = ${win} 
    , strategyA = ${strategyA} 
    , strategyB = ${strategyB} 
    WHERE id = ${id};`;
    return NextResponse.json({ result: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
