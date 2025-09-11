import { useAtomValue } from "jotai";
import type { UserLabelProps } from "./UserLabel";
import { numContestsAtom, ratingAtom } from "../../../rating/models/atom";
import { rawRatingAtom } from "../../../rating/models/getter";
import { RatingWithIconContainer } from "../../../rating/components/ratingWithIcon";

export const useUserLabel = (): UserLabelProps => {
    const rating = useAtomValue(ratingAtom);
    const numContests = useAtomValue(numContestsAtom);
    const rawRating = useAtomValue(rawRatingAtom);
    const rawRatingWithIcon = rawRating != null ? <RatingWithIconContainer rating={Math.floor(rawRating)} /> : "-";
    return {
        rating: rating != null ? rating.toString() : null,
        numContests: numContests != null ? numContests.toString() : null,
        rawRatingWithIcon,
    };
};
