import { useAtom } from "jotai";
import type { ContestHeaderCellProps } from "./ContestHeaderCell";
import { contestAtom } from "../../dict/contests";
import { getTextColor } from "./functions";

export const useContestHeaderCell = (contestId: string): ContestHeaderCellProps => {
    const [contest] = useAtom(contestAtom(contestId));
    if (contest == null) throw new Error(`Invalid contest id: ${contestId}`);
    const textColor = getTextColor(contest.m);
    const displayName = contestId.toUpperCase();
    const linkHref = `https://atcoder.jp/contests/${contestId}`;
    return { textColor, displayName, linkHref };
};
