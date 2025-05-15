import { atom } from "jotai";
import { getRawRating } from "./functions";

export const ratingAtom = atom<number | null>(null);

export const numContestsAtom = atom<number | null>(null);

export const rawRatingAtom = atom((get) => {
    const rating = get(ratingAtom);
    const numContests = get(numContestsAtom);
    return rating != null ? getRawRating(rating, numContests ?? Infinity) : null;
});
