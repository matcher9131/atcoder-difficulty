import type { ReactNode } from "react";
import { RatingInputContianer } from "../../../rating/components/ratingInput";
import { ThemeSelectorContainer } from "../../../settings/components/themeSelector";
import { LanguageSelectorContainer } from "../../../settings/components/languageSelector";

export const PageHeader = (): ReactNode => {
    return (
        <div className="w-full flex justify-between gap-x-2">
            <RatingInputContianer className="mr-auto" />
            <ThemeSelectorContainer />
            <LanguageSelectorContainer />
        </div>
    );
};
