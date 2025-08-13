import { atom } from "jotai";
import contestUrl from "../../../assets/contests.json?url";
import { parseDateOrNull } from "../../../utils/date";
import type { Contest } from "../types/contest";

type ContestsJson = {
    readonly body: Record<string, { readonly d: string; readonly m: number | "inf" }>;
    readonly lastOfChunks: readonly string[];
};

const loadContests = async (): Promise<ContestsJson> => {
    const response = await fetch(contestUrl);
    if (!response.ok) throw new Error("Failed loading contests.");
    return (await response.json()) as ContestsJson;
};

export const contestsJsonAtom = atom(await loadContests());

export const contestsAtom = atom((get) =>
    Object.entries(get(contestsJsonAtom).body)
        .flatMap(([id, { d, m }]) => {
            const date = parseDateOrNull(d);
            if (date == null) return [];
            return [{ id, d: date, m }];
        })
        .toSorted((x: Contest, y: Contest) => y.d.getTime() - x.d.getTime()),
);
