import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const revalidate = 0
 
export async function GET(request: Request) {
  try {
    const batches = await sql`SELECT * FROM batches;`;
    return NextResponse.json({ batches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
