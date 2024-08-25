import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { revalidateTag } from "next/cache";

export const revalidate = 1;
export async function GET(request) {
    try 
    {
        // purge cached data
        const tag = request.nextUrl.searchParams.get('tag')
        revalidateTag(tag);

        const response = await sql`SELECT * FROM resolutions ORDER BY resolution_id;`;
        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error)
    {
        return NextResponse.json({ error }, { status: 500 });
    }
}