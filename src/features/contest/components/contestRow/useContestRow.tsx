import { useAtom } from "jotai";
import type { ContestRowProps } from "./ContestRow";
import { ContestHeaderCellContainer } from "../contestHeaderCell";
import { contestProblemIdsAtom } from "../../../problem/dict/problems";
import { ProblemCellContainer } from "../../../problem/components/problemCell";

export const useContestRow = (contestId: string, numProblems: number): ContestRowProps => {
    const headerCell = <ContestHeaderCellContainer contestId={contestId} />;
    const [problemIds] = useAtom(contestProblemIdsAtom(contestId));
    const problemCells = problemIds.map((problemId) => (
        <ProblemCellContainer key={problemId} problemId={problemId} showsParameters={true} showsProblemIndex={false} />
    ));
    return { numProblems, headerCell, problemCells };
};
