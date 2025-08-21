import { useAtom } from "jotai";
import { solveProbabilitiesSlicedAtom } from "../../models/getter";
import type { SolveProbabilityTableProps } from "./SolveProbabilityTable";
import { SolveProbabilityRowContainer } from "../solveProbabilityRow";

export const useSolveProbabilityTable = (): SolveProbabilityTableProps => {
    const [problems] = useAtom(solveProbabilitiesSlicedAtom);
    const rows = problems.map((problem) => <SolveProbabilityRowContainer key={problem.id} problem={problem} />);
    return { rows };
};
