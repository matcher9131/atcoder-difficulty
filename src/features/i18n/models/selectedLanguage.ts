import { atomWithStorage } from "jotai/utils";
import type { Language } from "../types/language";

export const selectedLanguageAtom = atomWithStorage<Language>("atcoder-difficulty-language", "en", undefined, {
    getOnInit: true,
});
