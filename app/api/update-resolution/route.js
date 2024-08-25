// export const dynamic = 'force-dynamic';

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

        // delete this resolution's tasks and task instances using cascade
        await sql`
        DELETE FROM tasks
        WHERE resolution_id = ${data.resolution_id};`;
        
        for (const task of data.taskItems) 
        {
            // insert updated tasks
            const task_response = await sql`
            INSERT INTO tasks (resolution_id, title, description)
            VALUES (
                ${data.resolution_id},
                ${task.title},
                ${task.description}
            )
            RETURNING task_id;`;
            const task_id = task_response.rows[0].task_id;

            // insert updated task instances
            for (const task_instance of task.instances) {
                await sql`
                INSERT INTO task_instances (task_id, day_of_week, completed)
                VALUES (
                    ${task_id},
                    ${task_instance.day_of_week},
                    ${task_instance.completed == null ? false : task_instance.completed}
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