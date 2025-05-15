import type { ReactNode } from "react";
import { useLanguageSelector } from "./useLanguageSelector";
import { LanguageSelector } from "./LanguageSelector";

export const LanguageSelectorContainer = (): ReactNode => {
    const props = useLanguageSelector();
    return <LanguageSelector {...props} />;
};
