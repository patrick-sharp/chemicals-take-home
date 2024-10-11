import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let { batchID, status } = await request.json()
 
  try {
    const update = await sql`UPDATE batches SET status = ${status} WHERE id = ${batchID} RETURNING *;`;
    return NextResponse.json(update.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
