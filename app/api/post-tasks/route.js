export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request)
{
  const data = await request.json();

  const task_response = await sql`
  INSERT INTO tasks(resolution_id, title, description, recurrence_days)
  VALUES (
    ${data.resolution_id},
    ${data.title},
    ${data.desc},
    ${data.recurrence_days}
  )
  RETURNING task_id`; 
  const task_id = task_response.rows[0].task_id;
}