import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { convertDayOfWeek } from '@/lib/utility';
import { auth } from '@/auth';

export async function POST(req, res) {
    try 
    {
        const data = await req.json();

        // get user session
        const session = await auth();
        const user_id = session.user.user_id;

        // post resolution and get its id
        const resolution_response = await sql`
        INSERT INTO resolutions (user_id, title, description)
        VALUES (
            ${user_id},
            ${data.title}, 
            ${data.description}
        )
        RETURNING resolution_id;`;
        const resolution_id = resolution_response.rows[0].resolution_id;

        for (const task of data.taskItems) 
        {
            // post task and get its id
            const task_response = await sql`
            INSERT INTO tasks (user_id, resolution_id, title, description, recurrence_days)
            VALUES (
                ${user_id},
                ${resolution_id},
                ${task.title},
                ${task.description},
                ${task.recurrence_days}
            )
            RETURNING task_id;`;
            const task_id = task_response.rows[0].task_id;

            const date = new Date();
            const current_day_of_week = convertDayOfWeek(date.getDay());
            const formatted_date = date.toISOString().split('T')[0];
            if (task.recurrence_days[current_day_of_week]) 
            {
                await sql`
                INSERT INTO task_instances (user_id, task_id, date)
                VALUES (
                    ${user_id},
                    ${task_id},
                    ${formatted_date}
                );`;
            }
        };

        revalidatePath('/api/fetch-resolutions');
        revalidatePath('/api/fetch-task-instances');
        revalidatePath('/api/fetch-tasks-for-resolution');
        
        return NextResponse.json({ response: 'successfully posted resolution' }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);  
        return NextResponse.json({ error }, { status: 500 });
    }
}