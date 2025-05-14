import { useAtom } from "jotai";
import type { ThemeSelectorProps } from "./ThemeSelector";
import { isDarkModeAtom } from "../../models/isDarkMode";
import type { ChangeEvent } from "react";

export const useThemeSelector = (): ThemeSelectorProps => {
    const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
    return {
        isDarkMode,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            setIsDarkMode(e.target.checked);
        },
    };
};
