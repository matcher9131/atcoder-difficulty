// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { addDays, parseDateOrNull, setUTCTimeOfDay } from "./util.ts";
import { fetchUserData } from "./userData.ts";

const needsRefresh = (lastAccess: Date, now: Date): boolean => {
    // UserData should be refreshed at every Sat. 15:00 and Sun. 15:00 UTC
    // (Assume week starts on Sun.)
    // deno-fmt-ignore
    const refreshDate = now.getUTCDay() === 6 && now.getUTCHours() >= 15 ? setUTCTimeOfDay(now, 15) // should be refreshed at this Sat. 15:00 UTC
        : now.getUTCDay() === 0 && now.getUTCHours() < 15 ? addDays(setUTCTimeOfDay(now, 15), -1) // should be refreshed at last Sat. 15:00 UTC
        : addDays(setUTCTimeOfDay(now, 15), -now.getUTCDay()); // should be refreshed at this Sun. 15:00 UTC
    return lastAccess < refreshDate;
};

Deno.serve(async (request) => {
    const { userName } = await request.json();
    if (userName == null || userName === "") {
        return new Response("User name is missing", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl == null || supabaseKey == null) {
        return new Response("Invalid server settings", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("users").select().eq("user_name", userName);
    if (error) {
        return new Response("Something went wrong", { status: 500 });
    }

    if (data.length === 0) {
        // No user data in DB, so fetch user data and save it to DB, then return it.
        const userData = await fetchUserData(userName);
        const { rating, numContests } = userData ?? { rating: 0, numContests: 0 };
        supabase.from("users").insert({
            user_name: userName,
            rating,
            num_contests: numContests,
            last_access: new Date().toISOString(),
        });
        return new Response(JSON.stringify(userData), { status: 200 });
    } else {
        const lastAccess = parseDateOrNull(data[0]["last_access"] ?? "");
        if (lastAccess == null || needsRefresh(lastAccess, new Date())) {
            // User data exists in DB but old, so fetch new user data and save it to DB, then return it.
            const userData = await fetchUserData(userName);
            const { rating, numContests } = userData ?? { rating: 0, numContests: 0 };
            supabase.from("users").upsert({
                user_name: userName,
                rating,
                num_contests: numContests,
                last_access: new Date().toISOString(),
            });
            return new Response(JSON.stringify(userData), { status: 200 });
        } else {
            // User data exists in DB and new, so just return it.
            return new Response(JSON.stringify({ rating: data[0]["rating"], numContests: data[0]["num_contests"] }), {
                status: 200,
            });
        }
    }
});
