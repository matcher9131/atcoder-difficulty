import { getFillColor, getTextColor } from "../../functions/color";
import { getRatingIconHref } from "../../functions/icon";
import type { RatingWithIconProps } from "./RatingWithIcon";

export const useRatingWithIcon = (rating: number): RatingWithIconProps => {
    const iconHref = getRatingIconHref(rating);
    const iconFillColor = getFillColor(rating);
    const textColor = getTextColor(rating);
    return {
        iconHref,
        iconFillColor,
        textColor,
        rating,
    };
};
