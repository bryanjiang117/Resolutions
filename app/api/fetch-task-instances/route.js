import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { convertDayOfWeek } from '@/lib/utility';

export async function GET(request) {
    const current_day_of_week = convertDayOfWeek((new Date()).getDay());
    try
    {
        const response = await sql`
        SELECT 
            t.*, 
            ti.*
        FROM 
            tasks t
        RIGHT JOIN 
            task_instances ti
        ON 
            t.task_id = ti.task_id
        WHERE
            t.recurrence_days[${current_day_of_week} + 1] = true
        ORDER BY 
            t.task_id;`;

        const data = response.rows;

        return NextResponse.json({ data }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}