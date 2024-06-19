import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function DELETE(request: Request) {
  console.log('matches DELETEDELETEDELETEDELETEDELETE')
  try {
    await sql`DELETE FROM players;`;
    return NextResponse.json( { result: "OK"}, { status: 200 });
  
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: Request) {

  const { rows, rowCount } = await sql`
  

  select 
  e.season
  , e.name     as event_name
  , m.id       as match_id
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
  inner join (
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
  inner join (
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
  
;`;

  return NextResponse.json( rows , { status: 200 });
}


// select 
// e.season
// , e.name     as event_name
// , m.id       as match_id
// , ta.id      as teama_id
// , ta.name    as teama_name
// , tb.id      as teamb_id
// , tb.name    as teamb_name
// , m.win      as win
// , ca.counta  as counta
// , cb.countb  as countb
// from matches m
// inner join events e
// on m.event_id = e.id
// inner join teams ta
// on m.teama_id = ta.id
// inner join teams tb
// on m.teamb_id = tb.id
// inner join (
// select 
//   match_id
// , team_id
// , sum(win)  as counta
// from players
// group by 
//   match_id
// , team_id
// ) ca
// on ca.match_id = m.id
// and ca.team_id = ta.id
// inner join (
// select 
//   match_id
// , team_id
// , sum(win)  as countb
// from players
// group by 
//   match_id
// , team_id
// ) cb
// on cb.match_id = m.id
// and cb.team_id = tb.id



//   select 
  //     e.season
  //   , e.name     as event_name
  //   , m.id       as match_id
  //   , ta.id      as teama_id
  //   , ta.name    as teama_name
  //   , tb.id      as teamb_id
  //   , tb.name    as teamb_name
  //   , m.win      as win
  // from matches m
  // inner join events e
  //   on m.event_id = e.id
  // inner join teams ta
  //   on m.teama_id = ta.id
  // inner join teams tb
  //   on m.teamb_id = tb.id



  
//   select 
//   e.season
// , e.name     as event_name
// , m.id       as match_id
// , ta.id      as teama_id
// , ta.name    as teama_name
// , tb.id      as teamb_id
// , tb.name    as teamb_name
// , m.win      as win
// from matches m
// inner join events e
// on m.event_id = e.id
// inner join teams ta
// on m.teama_id = ta.id
// inner join teams tb
// on m.teamb_id = tb.id
// inner join (
// select 
// count(win)  as count
// from players
// where match_id = 35
// and team_id = 2
// ) ca
// on match_id = match_id



// select 
// match_id
// ,team_id
// ,count(win)  as count
// from players
// where match_id = 35
// and team_id = 2
// group by match_id
// ,team_id
