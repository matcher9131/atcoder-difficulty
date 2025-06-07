// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type UserData = {
    readonly rating: number;
    readonly numContests: number;
};

const fetchUserData = async (userName: string): Promise<UserData | null> => {
    const externalResponse = await fetch(`https://atcoder.jp/users/${userName}`);
    if (externalResponse.status === 404) {
        return null;
    } else if (externalResponse.status !== 200) {
        throw new Error("Failed to fetch");
    }

    const html = await externalResponse.text();
    const parser = new DOMParser().parseFromString(html, "text/html");
    const rating = parseInt(
        [...parser.querySelectorAll("tr")].find((tr) => tr.querySelector("th")?.textContent == "Rating")?.querySelector(
            "td span",
        )?.textContent ?? "",
    );
    const numContests = parseInt(
        [...parser.querySelectorAll("tr")].find((tr) => tr.querySelector("th")?.textContent == "Rated Matches ")
            ?.querySelector("td")?.textContent ?? "",
    );
    return !Number.isNaN(rating) && !Number.isNaN(numContests) ? { rating, numContests } : null;
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
    const { data, error } = await supabase.from("user").select().eq("user_name", userName);
    if (error) {
        return new Response("Something went wrong", { status: 500 });
    }

    // temp
    return new Response(JSON.stringify(data), { status: 200 });
});
