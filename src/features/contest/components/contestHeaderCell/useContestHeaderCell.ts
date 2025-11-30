import { useAtom } from "jotai";
import type { ContestHeaderCellProps } from "./ContestHeaderCell";
import { contestMaxRatingAtom } from "../../models/getter";
import { getTextColor } from "../../functions/textColor";
import { selectedContestAtom } from "../../../contestStats/models/selectedContest";
import { useOpenModalDialog } from "../../../dialog/hooks/useOpenModalDialog";

export const useContestHeaderCell = (contestId: string): ContestHeaderCellProps => {
    const [maxRating] = useAtom(contestMaxRatingAtom(contestId));
    const textColor = getTextColor(maxRating);
    const displayName = contestId.toUpperCase();
    const linkHref = `https://atcoder.jp/contests/${contestId}`;
    const [, setSelectedContest] = useAtom(selectedContestAtom);
    const { openDialog } = useOpenModalDialog("contestStats");
    const handleStatsButtonClick = () => {
        setSelectedContest(contestId);
        openDialog().catch(console.error);
    };
    const statsIconHref = "/resources/chart.svg#chart";
    return { textColor, displayName, linkHref, onStatsButtonClick: handleStatsButtonClick, statsIconHref };
};
