export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function POST(request) {
    try
    {
        const data = await request.json();

        await sql`
        UPDATE task_instances
        SET 
            completed = ${data.completed}
        WHERE task_instance_id = ${data.task_instance_id};`;

        const response = await sql`
        SELECT * FROM task_instances
        WHERE task_instance_id = ${data.task_instance_id};`;
        console.log(response);
        
        return NextResponse.json({ response: 'successfully updated task completion' }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
} 