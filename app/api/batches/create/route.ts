import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let { productID, amount } = await request.json()
 
  try {
    if (!amount) {
      const { rows } = await sql`SELECT default_batch_size FROM products WHERE id = ${productID}`;
      amount = rows[0].default_batch_size;
    }
    const insert = await sql`INSERT INTO batches (product_id, amount, status, date_scheduled) VALUES (${productID}, ${amount}, 'scheduled', now()) RETURNING *;`;
    return NextResponse.json(insert.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
