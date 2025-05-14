import { atomWithStorage } from "jotai/utils";

export const isDarkModeAtom = atomWithStorage("atcoder-difficulty-is-dark-mode", false, undefined, { getOnInit: true });
