import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'
import { revalidatePath } from "next/cache";

export async function POST(req, res) {
    try 
    {
        const data = await req.json();
        
        // CASCADE deletes tasks and task_instances
        await sql`DELETE FROM resolutions WHERE resolution_id = ${data.resolution_id};`;

        revalidatePath('/api/fetch-resolutions');

        return NextResponse.json({ response: 'successfully deleted resolution' }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}