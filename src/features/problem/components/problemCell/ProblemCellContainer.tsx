import { ProblemCell } from "./ProblemCell";
import { useProblemCell } from "./useProblemCell";

type ProblemCellContainerProps = {
    readonly problemId: string;
    readonly showsParameters: boolean;
    readonly showsProblemIndex: boolean;
};

export const ProblemCellContainer = ({ problemId, showsParameters, showsProblemIndex }: ProblemCellContainerProps) => {
    const props = useProblemCell(problemId, showsParameters, showsProblemIndex);
    return <ProblemCell {...props} />;
};
