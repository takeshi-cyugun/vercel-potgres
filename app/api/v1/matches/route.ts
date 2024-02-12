import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 

export async function GET(request: Request) {

    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  
    return NextResponse.json( { result: "GET OK" }, { status: 200 });
}
  
export async function POST(request: Request) {

  console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

  const reqBody = await request.json();
  console.log('reqBody: ', reqBody);
  

  const event_id = reqBody.event_id ? reqBody.event_id : null ;
  const round = reqBody.round ? reqBody.round : 0;
  const coat = reqBody.coat ? reqBody.coat : 0;
  const teamA_id = reqBody.teamA_id ? reqBody.teamA_id : null;
  const teamB_id = reqBody.teamB_id ? reqBody.teamB_id : null;
  console.log('teamB_id: ', teamB_id);
  console.log('coat: ', coat);
  console.log('round: ', round);


  if (!teamA_id || !teamB_id) {
    throw new Error('チームIDは必須です');
  }
  
  try {

    const { rows } = await sql`
    INSERT INTO matches (event_id, round, coat, teamA_id, teamB_id)
    VALUES (${event_id}, ${round}, ${coat}, ${teamA_id}, ${teamB_id})
    RETURNING id;
    `;

    return NextResponse.json( rows[0], { status: 200 });

  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
