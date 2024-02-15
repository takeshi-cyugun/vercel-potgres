import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request, { params }: { params: { id: number } }) {
  console.log('[GET]/matches/[id]')
  const match_id = params.id;
  if (!match_id) return new NextResponse("User ID is required", { status: 400 });

  const rows = await sql`
    SELECT 
      m.id                AS match_id
    , m.event_id          AS event_id
    , m.round             AS round
    , m.coat              AS coat
    , m.Teama_id          AS teamA_id
    , A.name              AS teamA_name
    , A.color_code        AS teamA_color_code
    , A.text_color_code   AS teamA_text_color_code
    , m.strategya         AS teama_strategy
    , m.Teamb_id          AS teamB_id
    , B.name              AS teamB_name
    , B.color_code        AS teamB_color_code
    , B.text_color_code   AS teamB_text_color_code
    , m.strategyb         AS teamb_strategy
    , m.win               AS win
    FROM matches m
    LEFT JOIN teams A
    ON m.Teama_id = A.id
    LEFT JOIN teams B
    ON m.Teamb_id = B.id
    WHERE m.id = ${match_id};
  `;
  
  console.log('rows', rows)

  const result = {
    match_id: rows.rows[0].match_id,
    event_id: rows.rows[0].event_id,
    round: rows.rows[0].round,
    coat: rows.rows[0].coat,
    A: {
      teamInfo: {
        id: rows.rows[0].teama_id,
        name: rows.rows[0].teama_name,
        textColorCode: rows.rows[0].teama_text_color_code,
        colorCode: rows.rows[0].teama_color_code,
      },
      strategy: rows.rows[0].teama_strategy,
    },
    B: {
      teamInfo: {
        id: rows.rows[0].teamb_id,
        name: rows.rows[0].teamb_name,
        textColorCode: rows.rows[0].teamb_text_color_code,
        colorCode: rows.rows[0].teamb_color_code,
      },
      strategy: rows.rows[0].teamb_strategy,
    },
    win: rows.rows[0].win
  }
  console.log('result', result)
  return NextResponse.json(result, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { id: number } }) {
  console.log('[PUT]/matches/[id]')
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
