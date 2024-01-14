export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try
    {
        const response = [];
        const task_response = await sql`SELECT * FROM tasks ORDER BY task_id;`;

        for (const task of task_response.rows) {
            
            const instance_response = await sql`
            SELECT * from task_instances
            WHERE task_id = ${task.task_id};`;

            response.push({
                task: task,
                instances: instance_response.rows
            });
            
        }

        return NextResponse.json({ response: response }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}