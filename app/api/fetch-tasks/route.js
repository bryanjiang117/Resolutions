import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres'; 
import { revalidateTag } from "next/cache";

export async function GET(request) {
    try
    {
        // purge cached data
        const tag = request.nextUrl.searchParams.get('tag')
        revalidateTag(tag);

        const url = new URL(request.url);
        const resolution_id = url.searchParams.get('resolution_id');
        
        const data = await sql`
        SELECT * FROM tasks
        WHERE resolution_id = ${resolution_id};`;

        const response = data.rows;

        return NextResponse.json({ response }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}   