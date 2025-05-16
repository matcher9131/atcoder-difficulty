import { atomWithStorage } from "jotai/utils";
import type { Language } from "../types/language";
import { atomEffect } from "jotai-effect";
import i18n from "i18next";

export const selectedLanguageAtom = atomWithStorage<Language>("atcoder-difficulty-language", "en", undefined, {
    getOnInit: true,
});

export const selectedLanguageEffect = atomEffect((get) => {
    i18n.changeLanguage(get(selectedLanguageAtom));
});
