import i18n from "i18next";
import { useAtom } from "jotai";
import { selectedLanguageAtom } from "../../models/selectedLanguage";
import type { LanguageSelectorProps } from "./LanguageSelector";

export const useLanguageSelector = (): LanguageSelectorProps => {
    const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
    return {
        selectedLanguage,
        onClickEnglish: () => {
            setSelectedLanguage("en");
            i18n.changeLanguage("en");
        },
        onClickJapanese: () => {
            setSelectedLanguage("ja");
            i18n.changeLanguage("ja");
        },
    };
};
