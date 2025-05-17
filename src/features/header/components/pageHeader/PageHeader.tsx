import type { ReactNode } from "react";
import { RatingInputContianer } from "../../../rating/components/ratingInput";
import { ThemeSelectorContainer } from "../../../siteTheme/components/themeSelector";
import { LanguageSelectorContainer } from "../../../i18n/components/languageSelector";

export const PageHeader = (): ReactNode => {
    return (
        <div className="w-full flex justify-between p-2 gap-x-2">
            <RatingInputContianer className="mr-auto" />
            <div className="px-5 font-orbiron flex items-center text-2xl">AtCoder Difficulty</div>
            <ThemeSelectorContainer />
            <LanguageSelectorContainer />
        </div>
    );
};
