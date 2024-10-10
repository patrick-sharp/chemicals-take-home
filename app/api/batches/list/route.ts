
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  let batches;
  try {
    batches = await sql`SELECT * FROM BATCHES;`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  return NextResponse.json({ batches }, { status: 200 });
}
