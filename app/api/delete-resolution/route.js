export const dynamic = 'force dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'

export async function POST(req, res) {
    try 
    {
        const response = await sql`DELETE FROM resolutions;`;
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}