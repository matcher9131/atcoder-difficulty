import type { ReactNode } from "react";
import { ContestHeaderCell } from "./ContestHeaderCell";
import { useContestHeaderCell } from "./useContestHeaderCell";

type ContestHeaderCellContainerProps = {
    readonly contestId: string;
};

export const ContestHeaderCellContainer = ({
    contestId,
}: ContestHeaderCellContainerProps): ReactNode => {
    const props = useContestHeaderCell(contestId);
    return <ContestHeaderCell {...props} />;
};
