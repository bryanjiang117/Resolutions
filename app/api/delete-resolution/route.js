export const dynamic = 'force dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'

export async function POST(req, res) {
    try 
    {
        const data = await req.json();
        
        // delete task instances and get task_ids of tasks to delete
        const taskResponse = await sql`
        DELETE FROM task_instances
        WHERE resolution_id = ${data.resolution_id}
        RETURNING task_id;`;

        // delete tasks 
        taskResponse.rows.map(async (task, index) => {
            await sql`
            DELETE FROM tasks
            WHERE task_id = ${task.task_id};`;
        });     

        //delete resolution
        await sql`DELETE FROM resolutions WHERE resolution_id = ${data.resolution_id};`;

        return NextResponse.json({ response: 'successfully deleted resolution' }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}