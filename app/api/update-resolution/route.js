export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function POST(req, res) {
    try 
    {
        const data = await req.json();

        await sql`
        UPDATE resolutions
        SET 
            title = ${data.title},
            description = ${data.desc}
        WHERE resolution_id = ${data.resolution_id};`;

        for (const task in data.tasks) 
        {
            const instance_response = await sql`
            SELECT * FROM task_instances
            WHERE resolution_id = ${data.resolution_id}
            LIMIT 1
            RETURNING task_id;`;
            const task_id = instance_response.rows[0].task_id;

            await sql`
            UPDATE tasks
            SET
                title = ${task.title},
                description = ${task.description}
            WHERE task_id = ${task_id};`;

            for (const task_instance in task.instances) 
            {
                await sql`
                UPDATE task_instances
                SET
                    day_of_week = ${task_instance.day_of_week},
                    start_time = ${task_instance.start_time},
                    end_time = ${task_instance.end_time},
                    completed = ${task_instance.completed}
                WHERE resolution_id = ${data.resolution_id}
                LIMIT 1;`;
            }
        }
        
        return NextResponse.json({ message: 'successfully updated resolution' }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}