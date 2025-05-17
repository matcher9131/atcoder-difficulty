import { atom } from "jotai";
import { getRawRating } from "./functions";
import { atomWithStorage } from "jotai/utils";

export const ratingAtom = atomWithStorage<number | null>("atcoder-difficulty-rating", null, undefined, {
    getOnInit: true,
});

export const numContestsAtom = atomWithStorage<number | null>("atcoder-difficulty-num-of-matches", null, undefined, {
    getOnInit: true,
});

export const rawRatingAtom = atom((get) => {
    const rating = get(ratingAtom);
    const numContests = get(numContestsAtom);
    return rating != null ? getRawRating(rating, numContests ?? Infinity) : null;
});
