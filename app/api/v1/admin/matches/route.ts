import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function DELETE(request: Request) {
  console.log('matches DELETEDELETEDELETEDELETEDELETE')
  try {
    await sql`DELETE FROM matches;`;
    return NextResponse.json( { result: "OK"}, { status: 200 });
  
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json( { result: "GET OK" }, { status: 200 });
}
