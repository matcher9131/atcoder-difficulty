import type { ReactNode } from "react";
import { useRatingWithIcon } from "./useRatingWithIcon";
import { RatingWithIcon } from "./RatingWithIcon";

type RatingWithIconContainerProps = {
    readonly rating: number;
};

export const RatingWithIconContainer = ({ rating }: RatingWithIconContainerProps): ReactNode => {
    const props = useRatingWithIcon(rating);
    return <RatingWithIcon {...props} />;
};
