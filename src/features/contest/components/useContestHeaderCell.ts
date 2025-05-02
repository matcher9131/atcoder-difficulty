import { useAtom } from "jotai";
import type { ContestHeaderCellProps } from "./ContestHeaderCell";
import { contestMaxRatingAtom } from "../dict/contests";
import { getTextColor } from "./functions";

export const useContestHeaderCell = (
    contestId: string,
): ContestHeaderCellProps => {
    const [maxRating] = useAtom(contestMaxRatingAtom(contestId));
    const textColor = getTextColor(maxRating);
    const displayName = contestId.toUpperCase();
    const linkHref = `https://atcoder.jp/contests/${contestId}`;
    return { textColor, displayName, linkHref };
};
