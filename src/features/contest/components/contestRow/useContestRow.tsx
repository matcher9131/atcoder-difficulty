import { useAtom } from "jotai";
import type { ContestRowProps } from "./ContestRow";
import { ContestHeaderCellContainer } from "../contestHeaderCell";
import { contestProblemIdsAtom } from "../../../problem/dict/problems";
import { ProblemCellContainer } from "../../../problem/components/problemCell";
import { range } from "../../../../utils/array";
import { BlankProblemCell } from "../../../problem/components/blankProblemCell";

export const useContestRow = (contestId: string, numProblems: number): ContestRowProps => {
    const headerCell = <ContestHeaderCellContainer contestId={contestId} />;
    const [problemIds] = useAtom(contestProblemIdsAtom(contestId));
    const problemCells = range(0, numProblems).map((i) =>
        i < problemIds.length ? (
            <ProblemCellContainer key={i} problemId={problemIds[i]} showsParameters={true} showsProblemIndex={false} />
        ) : (
            <BlankProblemCell key={i} />
        ),
    );
    return { headerCell, problemCells };
};
