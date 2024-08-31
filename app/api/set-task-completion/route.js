import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";

export async function POST(req) {
    try
    {
        const data = await req.json();

        const response = await sql`
        UPDATE task_instances
        SET 
            completed = ${data.completed}
        WHERE task_instance_id = ${data.task_instance_id};`;

        revalidatePath('/api/fetch-task-instances');

        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
} 