import type { ReactNode } from "react";
import { RatingInputContianer } from "../../../rating/components/ratingInput";
import { ThemeSelectorContainer } from "../../../settings/components/themeSelector";

export const PageHeader = (): ReactNode => {
    return (
        <div className="w-full flex justify-between">
            <RatingInputContianer className="mr-auto" />
            <ThemeSelectorContainer />
        </div>
    );
};
