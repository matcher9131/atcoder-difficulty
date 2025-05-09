import { atom } from "jotai";
import { problemsAtom } from "../../problem/dict/problems";
import { rawRatingAtom } from "../../rating/models/rating";
import { compareSolveProbability, irt2pl } from "./functions";
import { inverseAdjustmentOfLowRating } from "../../rating/models/functions";
import { lowerBound } from "../../../utils/array";
import { paginationValueAtom } from "../../pagination/model/paginations";

const solveProbabilitiesAtom = atom((get) => {
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

export const solveProbabilitiesMiddleIndexAtom = atom((get) => {
    return lowerBound(get(solveProbabilitiesAtom), (problem) => problem.solveProbability, 0.5);
});

export const solveProbabilitiesSlicedAtom = atom((get) => {
    const mid = get(solveProbabilitiesMiddleIndexAtom);
    const pageIndex = get(paginationValueAtom("solveProbability"));
    //
    console.log(`left = ${mid - 50 + 100 * pageIndex}, right = ${mid + 50 + 100 * pageIndex}`);
    //
    return get(solveProbabilitiesAtom).slice(Math.max(mid - 50 + 100 * pageIndex, 0), mid + 50 + 100 * pageIndex);
});
