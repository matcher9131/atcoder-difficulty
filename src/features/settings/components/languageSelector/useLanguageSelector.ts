import { useAtom } from "jotai";
import { selectedLanguageAtom } from "../../models/selectedLanguage";
import type { LanguageSelectorProps } from "./LanguageSelector";

export const useLanguageSelector = (): LanguageSelectorProps => {
    const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
    return {
        selectedLanguage,
        onClickEnglish: () => {
            setSelectedLanguage("en");
        },
        onClickJapanese: () => {
            setSelectedLanguage("ja");
        },
    };
};
