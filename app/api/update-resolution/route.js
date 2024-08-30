import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { convertDayOfWeek } from "@/lib/utility";

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
            // post task and get its id
            const task_response = await sql`
            INSERT INTO tasks (resolution_id, title, description, recurrence_days)
            VALUES (
                ${data.resolution_id},
                ${task.title},
                ${task.desc},
                ${task.recurrence_days}
            )
            RETURNING task_id;`;
            const task_id = task_response.rows[0].task_id;
            
            const date = new Date();
            const current_day_of_week = convertDayOfWeek(date.getDay());
            const formatted_date = date.toISOString().split('T')[0];
            if (task.recurrence_days[current_day_of_week])
            {
                console.log('-------------------------------YESSSIR-----------', current_day_of_week);
                await sql`
                INSERT INTO task_instances (task_id, date)
                VALUES (
                    ${task_id},
                    ${formatted_date}
                );`
            }
        };
        
        return NextResponse.json({ response: 'successfully updated resolution' }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}