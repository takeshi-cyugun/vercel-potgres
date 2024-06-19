import { sql, createClient  } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  console.log('[GET]/matches/list')

  const { searchParams } = new URL(request.url);
  const event_id = searchParams.get('event_id');
  const match_id = searchParams.get('match_id');
  const team_id = searchParams.get('team_id');
  
  console.log('event_id: ', event_id);
  console.log('match_id: ', match_id);
  console.log('team_id: ', team_id);

  const where: string[] = [];
  let whereSql = " "

  if (event_id) where.push("e.id = " + event_id)
  if (match_id) where.push("m.id = " + match_id)
  if (team_id) where.push("(m.teama_id = " + team_id + " or m.teamb_id = " + team_id +")")
  if (where.length) whereSql  = "where " + where.join(' AND ');
  console.log('whereSql: ', whereSql);

  const { rows, fields } =
      await sql`
          select 
          e.id       as event_id   
        , e.season   as season
        , e.name     as event_name
        , m.id       as match_id
        , m.round    as round
        , m.coat     as coat
        , ta.id      as teama_id
        , ta.name    as teama_name
        , tb.id      as teamb_id
        , tb.name    as teamb_name
        , m.win      as win
        , ca.counta  as counta
        , cb.countb  as countb
      from matches m
      inner join events e
        on m.event_id = e.id
      inner join teams ta
        on m.teama_id = ta.id
      inner join teams tb
        on m.teamb_id = tb.id
      left join (
        select 
            match_id
          , team_id
          , sum(win)  as counta
        from players
        group by 
          match_id
        , team_id
      ) ca
      on ca.match_id = m.id
      and ca.team_id = ta.id
      left join (
        select 
            match_id
          , team_id
          , sum(win)  as countb
        from players
        group by 
          match_id
        , team_id
      ) cb
      on cb.match_id = m.id
      and cb.team_id = tb.id
      order by m.id DESC
    ;`
    // where e.id = ${event_id}
    // and (m.teama_id = ${team_id} or m.teamb_id = ${team_id})

  return NextResponse.json( rows, { status: 200 });
}
  
export async function POST(request: Request) {
  console.log('[POST]/matches')
  const reqBody = await request.json();

  const event_id = reqBody.event_id ? reqBody.event_id : null ;
  const round = reqBody.round ? reqBody.round : 0;
  const coat = reqBody.coat ? reqBody.coat : 0;
  const teamA_id = reqBody.teamA_id ? reqBody.teamA_id : null;
  const teamB_id = reqBody.teamB_id ? reqBody.teamB_id : null;

  if (!teamA_id || !teamB_id) { throw new Error('チームIDは必須です');}
  
  try {
    const { rows, rowCount } = await sql`
    INSERT INTO matches (event_id, round, coat, teamA_id, teamB_id)
    VALUES (${event_id}, ${round}, ${coat}, ${teamA_id}, ${teamB_id})
    RETURNING id;
    `;
    return NextResponse.json( rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  console.log('[DELETE]/matches')
  try {
    await sql`DELETE FROM matches;`;
    return NextResponse.json( { result: "OK"}, { status: 200 });
  
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
