import { atom } from "jotai";
import { problemsAtom } from "../../problem/models/atom";
import { rawRatingAtom } from "../../rating/models/rating";
import { compareSolveProbability } from "../functions/compareSolveProbability";
import { inverseAdjustmentOfLowRating } from "../../rating/models/functions";
import { lowerBound } from "../../../utils/array";
import { paginationValueAtom } from "../../pagination/model/paginations";
import { itemsPerPageAtom } from "../../pagination/model/itemsPerPage";
import { atomFamily } from "jotai/utils";
import { irt2pl } from "../../../utils/math";

const problemsWithSolveProbabilityAtom = atom((get) => {
    const rating = get(rawRatingAtom);
    const problems = get(problemsAtom).map((problem) => ({
        ...problem,
        solveProbability:
            rating == null
                ? 2
                : problem.d == null
                  ? -1
                  : irt2pl(rating, problem.d[0], inverseAdjustmentOfLowRating(problem.d[1])),
    }));
    problems.sort(compareSolveProbability);
    return problems;
});

export const problemWithSolveProbabilityAtom = atomFamily((problemId: string) =>
    atom((get) => {
        return get(problemsWithSolveProbabilityAtom).find((problem) => problem.id === problemId);
    }),
);

export const solveProbabilitiesMiddleIndexAtom = atom((get) => {
    return lowerBound(get(problemsWithSolveProbabilityAtom), (problem) => problem.solveProbability, 0.5);
});

export const solveProbabilitiesSlicedAtom = atom((get) => {
    const mid = get(solveProbabilitiesMiddleIndexAtom);
    const pageIndex = get(paginationValueAtom("solveProbability"));
    const itemsPerPage = get(itemsPerPageAtom("solveProbability"));
    return get(problemsWithSolveProbabilityAtom).slice(
        Math.max(mid - itemsPerPage / 2 + itemsPerPage * pageIndex, 0),
        mid + itemsPerPage / 2 + itemsPerPage * pageIndex,
    );
});
