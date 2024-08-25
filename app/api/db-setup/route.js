    export const dynamic = 'force-dynamic';

    import { NextResponse } from 'next/server';
    import { sql } from '@vercel/postgres';
    import bcrypt from 'bcrypt';

    export async function GET(request) {
        try 
        {   
            await sql`DELETE FROM task_instances;`;
            await sql`DELETE FROM tasks;`;
            await sql`DELETE FROM resolutions;`;
            await sql`DELETE FROM users;`;

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
            
            await sql`
            CREATE TABLE IF NOT EXISTS task_instances (
                task_instance_id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
                day_of_week INTEGER,
                completed BOOLEAN NOT NULL DEFAULT FALSE
            );`;

            await sql`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                email varchar(255),
                password varchar(255)
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