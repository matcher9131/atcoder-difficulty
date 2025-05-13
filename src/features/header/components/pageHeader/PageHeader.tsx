import type { ReactNode } from "react";
import { RatingInputContianer } from "../../../rating/components/ratingInput";

export const PageHeader = (): ReactNode => {
    return (
        <div className="w-full flex">
            <RatingInputContianer />
        </div>
    );
};
