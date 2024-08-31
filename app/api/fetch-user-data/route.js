import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request) {
  try 
  {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    const response = await sql`
    SELECT *
    FROM users
    WHERE email = ${email};`;
    
    const data = response.rows;

    return NextResponse.json({ data }, {status: 200});
  } catch(error)
  {
    console.log(error);
    return NextResponse.json({ error }, {status: 500});
  }
}