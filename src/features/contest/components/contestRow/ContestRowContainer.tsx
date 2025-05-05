import type { ReactNode } from "react";
import { ContestRow } from "./ContestRow";
import { useContestRow } from "./useContestRow";

type ContestRowContainerProps = {
    readonly contestId: string;
    readonly numProblems: number;
};

export const ContestRowContainer = ({
    contestId,
    numProblems,
}: ContestRowContainerProps): ReactNode => {
    const props = useContestRow(contestId, numProblems);
    return <ContestRow {...props} />;
};
