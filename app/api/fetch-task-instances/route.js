import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { revalidateTag } from "next/cache";

export async function GET(request) {
    try
    {
        // purge cached data
        const tag = request.nextUrl.searchParams.get('tag')
        revalidateTag(tag);

        const data = await sql`
        SELECT 
            t.*, 
            ti.*
        FROM 
            tasks t
        RIGHT JOIN 
            task_instances ti
        ON 
            t.task_id = ti.task_id
        ORDER BY 
            t.task_id;`;
        // console.log(data.rows);

        const days_of_week_data = await sql`
        SELECT
            task_id,
            ARRAY_AGG(day_of_week ORDER BY day_of_week) AS days_of_week
        FROM 
            task_instances
        GROUP BY 
            task_id;`;
        // console.log(days_of_week_data.rows);

        const response = data.rows.map((task_instance) => {
            return {
                ...task_instance,
                days_of_week: days_of_week_data.rows.find((days_of_week) => {
                    return days_of_week.task_id === task_instance.task_id
                }).days_of_week
            }
        });
        console.log(response);

        return NextResponse.json({ response }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}