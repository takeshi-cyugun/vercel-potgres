import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('[GET]/players/list')
  const { searchParams } = new URL(request.url);
  const match_id = searchParams.get('match_id');
  const team_id = searchParams.get('team_id');

  const { rows, rowCount } = await sql`
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
    from matches m
      inner join teams t
      on m.teama_id = t.id
      inner join players p
      on p.team_id = t.id
      and m.id = p.match_id
      where t.id = ${team_id}
      and m.id = ${match_id}

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
    from matches m
      inner join teams t
      on m.teamb_id = t.id
      inner join players p
      on p.team_id = t.id
      and m.id = p.match_id
      where t.id = ${team_id}
      and m.id = ${match_id}
    ) A
    order by 2
  `;

  return NextResponse.json( rows , { status: 200 });
}


