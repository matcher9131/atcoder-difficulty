import { useAtom } from "jotai";
import { solveProbabilitiesSlicedAtom } from "../../models/solveProbabilities";
import type { SolveProbabilityTableProps } from "./SolveProbabilityTable";

export const useSolveProbabilityTable = (): SolveProbabilityTableProps => {
    const [problems] = useAtom(solveProbabilitiesSlicedAtom);
    return { problems };
};
