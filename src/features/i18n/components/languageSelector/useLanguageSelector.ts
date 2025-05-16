import { useAtom } from "jotai";
import type { LanguageSelectorProps } from "./LanguageSelector";
import { selectedLanguageAtom } from "../../models/selectedLanguage";

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
