export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req, res) {
    try 
    {
        const data = await req.json();

        // post resolution and get its id
        const resolution_response = await sql`
        INSERT INTO resolutions (title, description)
        VALUES (
            ${data.title}, 
            ${data.desc}
        )
        RETURNING resolution_id;`;
        const resolution_id = resolution_response.rows[0].resolution_id;

        // let response = new Array(data.tasks.length);
        for (const task of data.tasks) 
        {
            // post task and get its id
            const task_response = await sql`
            INSERT INTO tasks (title, description)
            VALUES (
                ${task.title},
                ${task.desc}
            )
            RETURNING task_id;`;
            const task_id = task_response.rows[0].task_id;
            // response.push({task_id: task_id, instance_ids: new Array(task.instances.length)});

            for (const task_instance of task.instances) 
            {
                const instance_response = await sql`
                INSERT INTO task_instances (resolution_id, task_id, day_of_week, start_time, end_time, completed)
                VALUES (
                    ${resolution_id},
                    ${task_id},
                    ${task_instance.day_of_week},
                    ${task_instance.start_time},
                    ${task_instance.end_time},
                    ${task_instance.completed}
                )
                RETURNING task_instance_id;`;
                const instance_id = instance_response.rows[0].task_instance_id;
                // response[response.length - 1].instance_ids.push(instance_id);
            }
        };
        
        return NextResponse.json({ response: 'successfully posted resolution' }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);  
        return NextResponse.json({ error }, { status: 500 });
    }
}