import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";

type UserData = {
    readonly rating: number;
    readonly numContests: number;
};

export const fetchUserData = async (userName: string): Promise<UserData | null> => {
    const externalResponse = await fetch(`https://atcoder.jp/users/${userName}`);
    if (externalResponse.status === 404) return null;
    else if (externalResponse.status !== 200) throw new Error("Failed to fetch");

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
