// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";

Deno.serve(async (request) => {
    const { userName } = await request.json();
    if (userName == null) {
        return new Response("User name is missing", { status: 400 });
    }

    const externalResponse = await fetch(`https://atcoder.jp/users/${userName}`);
    if (externalResponse.status === 404) {
        return new Response("User not found", { status: 404 });
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
    const data = { rating, numContests };
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getAtCoderUser' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
