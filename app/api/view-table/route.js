export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try 
    {
        const response = await sql`SELECT * FROM resolutions;`;
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error)
    {
        return NextResponse.json({ error }, { status: 500 });
    }
}