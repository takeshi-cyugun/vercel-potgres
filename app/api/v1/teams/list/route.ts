import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_id = searchParams.get('event_id');
  const team_id = searchParams.get('team_id');


  // if (event_id) {
  //   const where_event_id_a = `where ea.id = ${event_id}`
  //   const where_event_id_b = `where eb.id = ${event_id}`
  // }
  let where_team_id_a = " "
  let where_team_id_b = " "

  if (team_id) { 
    where_team_id_a = "where ta.id = " + team_id
    where_team_id_b = "where tb.id = " + team_id
  }

  const rows = await sql`
  
    select * from (
        select 
              ea.id as event_id
            , ea.name as event_name
            , ea.season as season
            , t.id as team_id
            , t.name as team_name 
            , ma.round as round 
            , ma.win as win 
            , CASE ma.win 
              WHEN '1' THEN '勝'
              ELSE '-'
              END win_jp
            , tb.id as match_team_id
            , tb.name as match_team_name
            , 'A' as position
        from teams t
        inner  join matches ma
            on t.id = ma.Teama_id
        inner  join teams tb
            on ma.Teamb_id = tb.id
        inner  join events ea
            on ma.event_id = ea.id
    union 
        select 
          eb.id as event_id
        , eb.name as event_name
        , eb.season as season
        , t.id as team_id
        , t.name as team_name 
        , mb.round as round 
        , mb.win as win 
        , CASE mb.win
          WHEN '1' THEN '勝'
          ELSE '-'
          END win_jp
        , ta.id as match_team_id
        , ta.name as match_team_name
        , 'B' as position
        from teams t
        inner  join matches mb
            on t.id = mb.Teamb_id
        inner  join teams ta
            on mb.Teama_id = ta.id
        inner  join events eb
            on mb.event_id = eb.id
       
        
    ) as A
    order by 1,3;
  `;
  // console.log('rows: ', rows.rows );
  return NextResponse.json( rows.rows , { status: 200 });

}

/*
, CASE ma.round 
WHEN 10 THEN '決勝'
WHEN 9  THEN '準決勝'
ELSE ma.round
END round_jp

, CASE mb.round 
WHEN 10 THEN '決勝'
WHEN 9  THEN '準決勝'
ELSE mb.round
END round_jp

*/

