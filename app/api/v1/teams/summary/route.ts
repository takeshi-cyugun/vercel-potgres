import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  console.log('[GET]/teams/summary')
  const { searchParams } = new URL(request.url);
  const event_id = searchParams.get('event_id');
  const team_id = searchParams.get('team_id');

  const rows = await sql`
    select * from (
      select 
        t.id          as team_id
      , t.name        as team_name
      , p.id          as player_id
      , p.grade       as grade
      , p.feature     as feature 
      , p.techniques  as techniques 
      , p.strong_weak as strong_weak
      , p.level       as level
      , p.win         as win
      , m.strategyA   as strategy
      , 'A'           as position
    from   matches m
      inner join teams t
      on m.teama_id = t.id
      inner join players p
      on p.team_id = t.id
      and m.id = p.match_id
      where t.id = ${team_id}
      and m.event_id = ${event_id}

    union 
      
      select 
        t.id          as team_id
      , t.name        as team_name
      , p.id          as player_id
      , p.grade       as grade
      , p.feature     as feature 
      , p.techniques  as techniques 
      , p.strong_weak as strong_weak
      , p.level       as level
      , p.win         as win
      , m.strategyB   as strategy
      , 'B'           as position
    from   matches m
      inner join teams t
      on m.teamb_id = t.id
      inner join players p
      on p.team_id = t.id
      and m.id = p.match_id
      where t.id = ${team_id}
      and m.event_id = ${event_id}
    ) A
    order by 2
  `;
  return NextResponse.json( rows.rows , { status: 200 });
  
//   const rows = await sql`
//     select * from (
//         select 
//             ea.name as event_name
//             , t.id as team_id
//             , t.name as team_name 
//             , ma.round as round 
//             , ma.win as win 
//             , CASE ma.win 
//               WHEN 'A' THEN '勝ち'
//               ELSE '負け'
//               END win_jp
//             , tb.id as match_team_id
//             , tb.name as match_team_name
//         from teams t
//         inner  join matches ma
//             on t.id = ma.Teama_id
//         inner  join teams tb
//             on ma.Teamb_id = tb.id
//         inner  join events ea
//             on ma.event_id = ea.id
//         where t.id = 2
//           and ea.id = 1
//     union 
//         select 
//             eb.name as event_name
//         ,  t.id as team_id
//         , t.name as team_name 
//         , mb.round as round 
//         , mb.win as win 
//         , CASE mb.win
//           WHEN 'B' THEN '勝ち'
//           ELSE '負け'
//           END win_jp
//         , ta.id as match_team_id
//         , ta.name as match_team_name
//         from teams t
//         inner  join matches mb
//             on t.id = mb.Teamb_id
//         inner  join teams ta
//             on mb.Teama_id = ta.id
//         inner  join events eb
//             on mb.event_id = eb.id
//         where t.id = 2
//           and eb.id = 1
//     ) as A
//     order by 1,3;




//     select * from players p
// left join matches m
// on p.match_id = m.id
// inner join events e
// on e.id = m.event_id
// where p.team_id = 2
// order by p.grade


// select * from events e
// inner join matches m
// on m.event_id = e.id

// left join teams ta
// on ta.id = m.teama_id

// left join teams tb
// on tb.id = m.teama_id

// where m.teama_id = 2 OR m.teamb_id = 2


// select * from teams t
// inner join players p
// on p.team_id = t.id
// where t.id = 2

//   `;

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

