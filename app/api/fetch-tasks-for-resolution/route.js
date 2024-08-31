import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres'; 

export async function GET(req) {
    try
    {
        const url = new URL(req.url);
        const resolution_id = url.searchParams.get('resolution_id');
        
        const response = await sql`
        SELECT * FROM tasks
        WHERE resolution_id = ${resolution_id};`;

        const data = response.rows;

        return NextResponse.json({ data }, { status: 200 });
    } 
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}   