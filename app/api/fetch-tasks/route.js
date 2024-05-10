export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try
    {
        const url = new URL(request.url);
        const resolution_id = url.searchParams.get('resolution_id');
        const taskResponse = await sql`
        SELECT * FROM tasks
        WHERE resolution_id = ${resolution_id};`;

        let taskItems = [];
        for (const task of taskResponse.rows) {
            console.log("fetch-tasks: ", task);
            const instanceResponse = await sql`
            SELECT * FROM task_instances
            WHERE task_id = ${task.task_id};`;

            taskItems.push(
                {
                    title: task.title,
                    description: task.description,
                    instances: instanceResponse.rows
                } 
            );

        }
        return NextResponse.json({ taskItems: taskItems }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}   