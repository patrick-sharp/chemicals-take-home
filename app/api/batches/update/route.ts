import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let { batchID, status } = await request.json()

  try {
    let update;
    switch(status) {
      case 'in-progress':
        //update = await sql`UPDATE batches SET status = ${status}, date_in_progress = ${Date.now().toISOString()}::timestamp without time zone WHERE id = ${batchID} RETURNING *;`;
        update = await sql`UPDATE batches SET status = ${status}, date_in_progress = now() WHERE id = ${batchID} RETURNING *;`;
        break;
      case 'completed':
        update = await sql`UPDATE batches SET status = ${status} WHERE id = ${batchID} RETURNING *;`;
        break;
      default:
        throw new Error('invalid new status');
    }
    return NextResponse.json(update.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
