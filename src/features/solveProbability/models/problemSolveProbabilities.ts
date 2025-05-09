import { atom } from "jotai";
import { problemsAtom } from "../../problem/dict/problems";
import { rawRatingAtom } from "../../rating/models/rating";
import { compareSolveProbability, irt2pl } from "./functions";
import { inverseAdjustmentOfLowRating } from "../../rating/models/functions";
import { binarySearch } from "../../../utils/array";
import { solveProbabilityPaginationValueAtom } from "../../pagination/model/paginations";

const problemSolveProbabilitiesAtom = atom((get) => {
    const rating = get(rawRatingAtom);
    if (rating == null) return [];
    const problems = get(problemsAtom).map((problem) => ({
        ...problem,
        solveProbability:
            problem.d == null ? -1 : irt2pl(rating, problem.d[0], inverseAdjustmentOfLowRating(problem.d[1])),
    }));
    problems.sort(compareSolveProbability);
    return problems;
});

export const problemSolveProbabilitiesMiddleIndexAtom = atom((get) => {
    return binarySearch(get(problemSolveProbabilitiesAtom), (problem) => problem.solveProbability, 0.5);
});

export const problemSolveProbabilitiesSlicedAtom = atom((get) => {
    const mid = get(problemSolveProbabilitiesMiddleIndexAtom);
    const pageIndex = get(solveProbabilityPaginationValueAtom);
    return get(problemSolveProbabilitiesAtom).slice(mid - 50 + 100 * pageIndex, mid + 50 + 100 * pageIndex);
});
