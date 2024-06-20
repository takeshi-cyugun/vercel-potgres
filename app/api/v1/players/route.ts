import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  console.log('[GET]/players')
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season');
  const where = (season) ? `where season = ${season};` : ''
  const rows = await sql`SELECT * FROM players;`;
  console.log('rows: ', rows);
  return NextResponse.json( rows.rows, { status: 200 });
}


// export async function POST(request: Request, { params }: { params: { id: string } },) {
export async function POST(request: Request) {
  console.log('[POST]/players')
  const reqBody = await request.json();
  console.log('reqBody: ', reqBody);

  const season: number | null = (reqBody.season) ? reqBody.season : null
  const match_id: number | null = (reqBody.match_id) ? reqBody.match_id : null
  const grade: string | null = (reqBody.grade) ? reqBody.grade : null
  // const feature: string | null = (reqBody.feature) ? reqBody.feature : null
  // const technique: string[] | null = (reqBody.technique) ? reqBody.technique : null
  // const strong_weak: string | null = (reqBody.strong_weak) ? reqBody.strong_weak : null
  // const level: number | null = (reqBody.level) ? reqBody.level : null
  // const win: string | null = (reqBody.win) ? reqBody.win : null


  const players = [reqBody.player.A, reqBody.player.B]

  try {
    if (!reqBody.match_id) throw new Error('match_id is required');

    const result = await Promise.all(players.map(async (player)=>{

      // console.log('player: ', player);
      // const aaa = `
      // INSERT INTO players (season, team_id, match_id, grade, feature, strong_weak, level, win) VALUES 
      //   (${season}, ${player.team_id}, ${match_id}, ${grade}, ${player.Feature}, ${player.StrongWeak}, ${player.Level}, ${player.win}) RETURNING id;`;

      // console.log('aaa: ', aaa);
      console.log('technique: ', player.technique);

      const technique = player.technique.join(",")

      return await sql`
      INSERT INTO players (season, team_id, match_id, grade, feature, techniques, strong_weak, level, win, clothing, hairstyle, shoes, nickname) VALUES 
        (${season}, ${player.team_id}, ${match_id}, ${grade}, ${player.Feature}, ${technique}, ${player.StrongWeak}, 
          ${player.Level}, ${player.win}, ${player.clothing}, ${player.hairstyle}, ${player.shoes}, ${player.nickname} ) RETURNING id;`;
    }));
    // console.log('result: ', result);
  
    return NextResponse.json( { result: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * 選手情報を全削除（管理者画面）
 */
export async function DELETE(request: Request) {
  console.log('[DELETE]/players')
  // console.log('players DELETEDELETEDELETEDELETEDELETE')
  try {
    await sql`DELETE FROM players where lock_flag is null;`;
    return NextResponse.json( { result: "OK"}, { status: 200 });
  
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
