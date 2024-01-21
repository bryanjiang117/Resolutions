export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function POST(req, res) {
    try 
    {
        const data = await req.json();

        // update resolution
        await sql`
        UPDATE resolutions
        SET 
            title = ${data.title},
            description = ${data.desc}
        WHERE resolution_id = ${data.resolution_id};`;

        // delete task instances and tasks associated with resolution (cascade deletes tasks)
        await sql`
        DELETE FROM task_instances
        WHERE resolution_id = ${data.resolution_id};`;
        
        for (const task of data.taskItems) 
        {
            // insert updated tasks
            const task_response = await sql`
            INSERT INTO tasks (title, description)
            VALUES (
                ${task.title},
                ${task.description}
            )
            RETURNING task_id;`;
            const task_id = task_response.rows[0].task_id;

            // insert updated task instances
            for (const task_instance of task.instances) {
                await sql`
                INSERT INTO task_instances (resolution_id, task_id, day_of_week, start_time, end_time, completed)
                VALUES (
                    ${data.resolution_id},
                    ${task_id},
                    ${task_instance.day_of_week},
                    ${task_instance.start_time},
                    ${task_instance.end_time},
                    ${task_instance.completed}
                );`;
            }
        }
        
        
        return NextResponse.json({ response: 'successfully updated resolution' }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}