export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { parse } from "url";

export async function GET(request) {
    try
    {
        const parsedUrl = parse(request.url, true);
        const { resolution_id } = parsedUrl.query;
        const resolutionResponse = await sql`
        SELECT task_id FROM task_instances
        WHERE resolution_id = ${resolution_id};`;

        let response = [];
        const visitedTask = new Set();
        for (const task of resolutionResponse.rows) {

            if (visitedTask.has(task.task_id)) {
                continue;
            }
            visitedTask.add(task.task_id);

            const taskResponse = await sql`
            SELECT * FROM tasks
            WHERE task_id = ${task.task_id};`;

            const instanceResponse = await sql`
            SELECT * FROM task_instances
            WHERE task_id = ${task.task_id};`;

            response.push(
                {
                    title: taskResponse.rows[0].title,
                    description: taskResponse.rows[0].description,
                    instances: instanceResponse.rows
                } 
            );

            console.log('taskItems ', response);

        }
        return NextResponse.json({ taskItems: response }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}