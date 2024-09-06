import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";

export async function GET(request) {
  try 
  {
    const url = new URL(request.url);

    const session = await auth();
    const user_id = session.user.user_id;
    
    const response = await sql`
    SELECT *
    FROM users
    WHERE user_id = ${user_id};`;
    
    const data = response.rows[0];

    return NextResponse.json({ data }, {status: 200});
  } catch(error)
  {
    console.log(error);
    return NextResponse.json({ error }, {status: 500});
  }
}