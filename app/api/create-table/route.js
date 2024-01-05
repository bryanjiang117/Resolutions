import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try 
    {
        // const response = await sql`DROP TABLE resolutions;`;
        const response = await sql`CREATE TABLE IF NOT EXISTS resolutions ( name varchar(255), freq INTEGER, description varchar(255) );`;

        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        return NextResponse.json({ error }, { status: 500 });
    }
}