import { useAtom } from "jotai";
import { problemSolveProbabilitiesSlicedAtom } from "../../models/problemSolveProbabilities";
import type { ProblemSolveProbabilityTableProps } from "./ProblemSolveProbabilityTable";

export const useProblemSolveProbabilityTable = (): ProblemSolveProbabilityTableProps => {
    const [problems] = useAtom(problemSolveProbabilitiesSlicedAtom);
    return { problems };
};
