import { useAtomValue } from "jotai";
import type { UserLabelProps } from "./UserLabel";
import { numContestsAtom, ratingAtom } from "../../../rating/models/rating";
import { getFillColor, getTextColor } from "../../../rating/functions/color";

export const useUserLabel = (): UserLabelProps => {
    const rating = useAtomValue(ratingAtom);
    const numContests = useAtomValue(numContestsAtom);
    const rawRating = useAtomValue(ratingAtom);
    const iconFillColor = rawRating != null ? getFillColor(rawRating) : "";
    const textColor = rawRating != null ? getTextColor(rawRating) : "";
    const level = rawRating != null ? (rawRating >= 3200 ? 4 : (Math.floor(rawRating / 100) % 4) + 1) : 0;
    const iconHref =
        rawRating != null
            ? (import.meta.env.PROD ? "/atcoder-difficulty" : "") +
              `/resources/up_arrow_${level.toString()}.svg#up_arrow_${level.toString()}`
            : "";
    return {
        rating: rating != null ? rating.toString() : null,
        numContests: numContests != null ? numContests.toString() : null,
        rawRating: rawRating != null ? rawRating.toString() : null,
        iconHref,
        iconFillColor,
        textColor,
    };
};
