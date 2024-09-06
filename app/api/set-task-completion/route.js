import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { convertDayOfWeek } from "@/lib/utility";

export async function POST(req) {
    try
    {
        const data = await req.json();
        console.log('data:', data);
        // get user session
        const session = await auth();
        const user_id = session.user.user_id;



        // QUERY NECESSARY DATA

        let response = await sql`
        SELECT total_completed, total_missed
        FROM users
        WHERE user_id = ${user_id};`;
        const user_data = response.rows[0];

        response = await sql`
        SELECT date, completed
        FROM daily_user_data
        WHERE user_id = ${user_id}
        ORDER BY date ASC;`;
        const daily_data = response.rows;
        


        // UPDATE TASK INSTANCES

        await sql`
        UPDATE task_instances
        SET 
            completed = ${data.completed}
        WHERE task_instance_id = ${data.task_instance_id}
        RETURNING completed;`;



        // UPDATE DAILY USER DATA
        
        let completed_today = 0;
        let missed_today = 0;
        if (daily_data.length > 0) {
            let todays_date = (new Date()).toISOString().split('T')[0];
            let completed_today = daily_data[daily_data.length - 1].completed;
            let missed_today = daily_data[daily_data.length - 1].missed;
            completed_today = data.completed ? completed_today + 1 : completed_today - 1;
            missed_today = data.completed ? missed_today + 1 : missed_today - 1;
            await sql`
            UPDATE daily_user_data
            SET
                completed = ${completed_today},
                missed = ${missed_today}
            WHERE 
                user_id = ${user_id} &&
                date = ${todays_date};`;
        }

        

        // UPDATE USER DATA

        // total completed / missed 
        let total_completed = user_data.total_completed;
        let total_missed = user_data.total_missed;
        total_completed = data.completed ? total_completed + 1 : total_completed - 1;
        total_missed = data.completed ? total_missed - 1 : total_completed + 1;

        // streak
        let streak = 0;
        let i = 0;
        while (i < daily_data.length && daily_data[i].completed >= 1)
        {
            streak++;
            i++;
        }   

        // completed (for the past week)
        let completed_this_week = 0;
        for (let i = 0; i < Math.min(7, daily_data.length); i++) 
        {
            completed_this_week += daily_data[i].completed_this_week;
        }

        // missed (missed yesterday)
        const missed_yesterday = daily_data.length > 0 ? daily_data[1].missed : 0;

        // completion rate
        const completion_rate = (total_completed / (total_completed + total_missed)) * 100;

        // best / worst day
        let best_day = null;
        let worst_day = null;
        let week_data = Array.from({length: 7}, (_, i) => ({
            day: i,
            completed: 0,
            missed: 0,
        }));
        // aggregate daily data into data for each day of the week
        week_data = daily_data.reduce((prev, data) => {
            const day_of_week = convertDayOfWeek(data.date.getDay());
            prev[day_of_week].completed += data.completed;
            prev[day_of_week].missed += data.missed;
        }, [week_data]);
        // remove days with no tasks
        week_data.filter((data) => data.completed + data.missed != 0); 
        // stable sort by least important aspect to most important 
        if (week_data.length > 0) {
            week_data.sort((a, b) => a.completed - b.completed); // more completed = better
            week_data.sort((a, b) => b.missed - a.missed); // less missed = better
            week_data.sort((a, b) => (a.completed / (a.completed + a.missed)) - (b.completed / (b.completed + b.missed))); // high accuracy = better
            best_day = week_data[0].day;
            worst_day = week_data[Math.min(6, week_data.length - 1)].day;
        }

        // set to new values
        await sql`
        UPDATE users
        SET 
            total_completed = ${total_completed},
            total_missed = ${total_missed},
            streak = ${streak},
            completed_this_week = ${completed_this_week},
            missed_yesterday = ${missed_yesterday},
            completion_rate = ${completion_rate},
            best_day = ${best_day},
            worst_day = ${worst_day}
        WHERE user_id = ${user_id};`;


        
        revalidatePath('/api/fetch-task-instances');
        revalidatePath('/api/fetch-user-data');
        revalidatePath('/api/fetch-daily-data');
        revalidatePath('/api/set-task-completion');

        return NextResponse.json({ response }, { status: 200 });
    }
    catch (error) 
    {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
