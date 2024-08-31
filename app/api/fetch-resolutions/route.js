import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const revalidate = 1;
export async function GET(request) {
    try {
        const response = await sql`SELECT * FROM resolutions ORDER BY resolution_id;`;
        
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error)
    {
        return NextResponse.json({ error }, { status: 500 });
    }
}