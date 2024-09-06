import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'; 
import { revalidateTag } from "next/cache";
import bcrypt from 'bcrypt';

export async function GET(request) {
    try 
    {   
        const tag = request.nextUrl.searchParams.get('tag')
        revalidateTag(tag); 

        await sql`DROP TABLE IF EXISTS task_instances;`;
        await sql`DROP TABLE IF EXISTS tasks;`;
        await sql`DROP TABLE IF EXISTS resolutions;`;
        await sql`DROP TABLE IF EXISTS users;`;

        await sql`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            total_completed INTEGER DEFAULT 0,
            total_missed INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            completed_this_week INTEGER DEFAULT 0,
            missed_yesterday INTEGER DEFAULT 0,
            completion_rate FLOAT DEFAULT 0,
            best_day INTEGER CHECK (best_day BETWEEN 0 AND 6),
            worst_day INTEGER CHECK (worst_day BETWEEN 0 AND 6)
        );`;

        await sql`CREATE TABLE IF NOT EXISTS resolutions (
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            resolution_id SERIAL PRIMARY KEY,
            title varchar(255) NOT NULL DEFAULT '', 
            description varchar(255) NOT NULL DEFAULT '',
            category varchar(255)
        );`;

        await sql`
        CREATE TABLE IF NOT EXISTS tasks (
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            resolution_id INTEGER REFERENCES resolutions(resolution_id) ON DELETE CASCADE,
            task_id SERIAL PRIMARY KEY,
            title varchar(255) NOT NULL DEFAULT '',
            description varchar(255) NOT NULL DEFAULT '',
            recurrence_days BOOLEAN[] NOT NULL DEFAULT ARRAY[false, false, false, false, false, false, false]
        );`;

        await sql`
        CREATE TABLE IF NOT EXISTS task_instances(
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
            task_instance_id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            UNIQUE (task_id, date)
        )`;

        await sql`
        CREATE TABLE IF NOT EXISTS daily_user_data(
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            date DATE NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            missed INTEGER NOT NULL DEFAULT 0
        );`;
        
        // seeding users 
        const email = 'haozhoujiang@gmail.com';
        const password = await bcrypt.hash('a', 10);
        await sql`
        INSERT INTO users (email, password)
        VALUES (
            ${email},
            ${password}
        );`;
        
        return NextResponse.json({ result: 'success' }, {status: 200});
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}