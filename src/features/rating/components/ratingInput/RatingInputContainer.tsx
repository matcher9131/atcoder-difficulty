import type { ReactNode } from "react";
import { useRatingInput } from "./useRatingInput";
import { RatingInput } from "./RatingInput";

export const RatingInputContianer = ({ className }: { readonly className?: string }): ReactNode => {
    const props = useRatingInput();
    return <RatingInput {...props} className={className} />;
};
