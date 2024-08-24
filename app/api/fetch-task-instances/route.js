export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try
    {
        const data = await sql`
        SELECT 
            t.*, 
            ti.*, 
            (
                SELECT COUNT(*)
                FROM task_instances
                WHERE task_instances.task_id = t.task_id
            ) AS instance_count
        FROM 
            tasks t
        RIGHT JOIN 
            task_instances ti
        ON 
            t.task_id = ti.task_id
        ORDER BY 
            t.task_id;`;
        const response = data.rows;

        return NextResponse.json({ response }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}