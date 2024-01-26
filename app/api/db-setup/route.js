export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try 
    {   
        await sql`DROP TABLE IF EXISTS task_instances;`;
        await sql`DROP TABLE IF EXISTS tasks;`;
        await sql`DROP TABLE IF EXISTS resolutions;`;

        await sql`CREATE TABLE IF NOT EXISTS resolutions (
            resolution_id SERIAL PRIMARY KEY,
            title varchar(255), 
            description varchar(255) 
        );`;

        await sql`
        CREATE TABLE IF NOT EXISTS tasks (
            task_id SERIAL PRIMARY KEY,
            resolution_id INTEGER REFERENCES resolutions(resolution_id) ON DELETE CASCADE,
            title varchar(255),
            description varchar(255)
        );`;
        
        const response = await sql`
        CREATE TABLE IF NOT EXISTS task_instances (
            task_instance_id SERIAL PRIMARY KEY,
            task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
            day_of_week INTEGER,
            start_time TIME,
            end_time TIME,
            completed BOOLEAN NOT NULL DEFAULT FALSE
        );`;
        
        return NextResponse.json({ response }, {status: 200});
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}