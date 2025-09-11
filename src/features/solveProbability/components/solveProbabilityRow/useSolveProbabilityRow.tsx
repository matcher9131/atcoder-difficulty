import { useAtom } from "jotai";
import { ContestHeaderCellContainer } from "../../../contest/components/contestHeaderCell";
import { ProblemCellContainer } from "../../../problem/components/problemCell";
import { splitProblemId } from "../../../problem/functions/split";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { toPercent } from "../../functions/toPercent";
import type { SolveProbabilityRowProps } from "./SolveProbabilityRow";
import { selectedProblemAtom } from "../../../distribution/models/selectedProblem";
import { useOpenModalDialog } from "../../../dialog/hooks/useOpenModalDialog";

export const useSolveProbabilityRow = (problem: ProblemSolveProbability): SolveProbabilityRowProps => {
    const [contestId] = splitProblemId(problem.id);
    const contestHeaderCell = <ContestHeaderCellContainer contestId={contestId} />;
    const problemId = problem.id;
    const problemCell = (
        <ProblemCellContainer
            problemId={problemId}
            showsParameters={false}
            showsProblemIndex={true}
            showsOpenGraphButton={false}
        />
    );
    const difficulty = problem.d?.[1]?.toString() ?? "NaN";
    const solveProbability = toPercent(problem.solveProbability);
    const [, setSelectedProblem] = useAtom(selectedProblemAtom);
    const { openDialog } = useOpenModalDialog("distribution");
    const handleGraphButtonClick = () => {
        setSelectedProblem(problemId);
        openDialog().catch(console.error);
    };
    return {
        contestHeaderCell,
        problemCell,
        difficulty,
        solveProbability,
        onGraphButtonClick: handleGraphButtonClick,
    };
};
