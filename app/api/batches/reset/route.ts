import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  let batches;
  try {
    await sql`DELETE FROM batches;`;
    // might be cleaner to call the template tag function explicitly instead of using template literal
    // await sql`
    //   INSERT INTO batches(product_id, amount, status, date_scheduled, date_in_progress, date_completed)
    //   VALUES 
    //     ('chem-a',  40, 'completed',   '2024-09-01'::timestamp without time zone, '2024-09-02'::timestamp without time zone, '2024-09-10'::timestamp without time zone);`;
    await sql`
      INSERT INTO batches(product_id, amount, status, date_scheduled, date_in_progress, date_completed)
      VALUES 
        ('chem-a',  40, 'completed',   '2024-09-01'::timestamp without time zone, '2024-09-02'::timestamp without time zone, '2024-09-10'::timestamp without time zone),
        ('chem-a',  20, 'in-progress', '2024-09-02'::timestamp without time zone, '2024-09-03'::timestamp without time zone, null                                     ),
        ('chem-a',  20, 'scheduled',   '2024-09-03'::timestamp without time zone, null                                     , null                                     ),
        ('chem-c', 300, 'completed',   '2024-09-04'::timestamp without time zone, '2024-09-05'::timestamp without time zone, '2024-09-14'::timestamp without time zone),
        ('chem-c', 300, 'scheduled',   '2024-09-04'::timestamp without time zone, null                                     , null                                     ),
        ('chem-d', 500, 'in-progress', '2024-09-05'::timestamp without time zone, '2024-09-06'::timestamp without time zone, null                                     );`;
    const batches = await sql`SELECT * FROM batches;`;
    return NextResponse.json({ batches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  };
 
  return NextResponse.json({ batches }, { status: 200 });
}
