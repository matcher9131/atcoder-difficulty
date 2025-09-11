import { atom } from "jotai";
import { numContestsAtom, ratingAtom } from "./atom";
import { getRawRating } from "../functions/adjustment";

export const rawRatingAtom = atom((get) => {
    const rating = get(ratingAtom);
    const numContests = get(numContestsAtom);
    return rating != null ? getRawRating(rating, numContests ?? Infinity) : null;
});
