import { ProblemCell } from "./ProblemCell";
import { useProblemCell } from "./useProblemCell";

type ProblemCellContainerProps = {
    readonly problemId: string;
};

export const ProblemCellContainer = ({
    problemId,
}: ProblemCellContainerProps) => {
    const props = useProblemCell(problemId);
    return <ProblemCell {...props} />;
};
