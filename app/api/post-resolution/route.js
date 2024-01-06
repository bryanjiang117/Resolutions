export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req, res) {
    try 
    {
        const data = await req.json();
        console.log(data);
        // const response = await sql`DELETE FROM resolutions;`;
        const response = await sql`
        INSERT INTO resolutions (name, freq, description)
        VALUES (${data.name}, ${data.freq}, ${data.desc});`;
        // console.log(response);
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);  
        return NextResponse.json({ error }, { status: 500 });
    }
}