import { ProblemCell } from "./ProblemCell";
import { useProblemCell } from "./useProblemCell";

type ProblemCellContainerProps = {
    readonly problemId: string;
    readonly showsParameters: boolean;
    readonly showsProblemIndex: boolean;
    readonly showsOpenGraphButton: boolean;
};

export const ProblemCellContainer = ({
    problemId,
    showsParameters,
    showsProblemIndex,
    showsOpenGraphButton,
}: ProblemCellContainerProps) => {
    const props = useProblemCell(problemId, showsParameters, showsProblemIndex, showsOpenGraphButton);
    return <ProblemCell {...props} />;
};
