import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// TODO: make this reset the batches state to the default
 
export async function GET(request: Request) {
  let batches;
  try {
    batches = await sql`SELECT * FROM BATCHES;`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  return NextResponse.json({ batches }, { status: 200 });
}
