import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";
import { parseDateOrNull } from "./util.ts";

export const getLatestContestDate = async (): Promise<Date | null> => {
    const response = await fetch("https://atcoder.jp/contests/archive");
    if (response.status !== 200) return null;

    const html = await response.text();
    const parser = new DOMParser().parseFromString(html, "text/html");
    const dates = [...parser.querySelectorAll("tbody tr")].flatMap((tr) => {
        const algorithm = tr.querySelector("span[title='Algorithm']");
        if (algorithm == null) return [];

        const date = parseDateOrNull(tr.querySelector("time")?.textContent ?? "");
        return date != null ? [date] : [];
    });

    return dates.length > 0 ? dates[0] : null;
};
