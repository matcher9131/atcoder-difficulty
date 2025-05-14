import type { ReactNode } from "react";
import { useThemeSelector } from "./useThemeSelector";
import { ThemeSelector } from "./ThemeSelector";

export const ThemeSelectorContainer = (): ReactNode => {
    const props = useThemeSelector();
    return <ThemeSelector {...props} />;
};
