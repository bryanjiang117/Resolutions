export const dynamic = 'force dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'

export async function POST(req, res) {
    try 
    {
        // TO DO delete related tasks and task instances
        const data = await req.json();
        const response = await sql`DELETE FROM resolutions WHERE resolution_id = ${data.resolution_id};`;
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}