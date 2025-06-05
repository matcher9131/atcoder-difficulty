import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { isDarkModeAtom } from "../../../siteTheme/models/isDarkMode";

export const LoadingIndicator = (): ReactNode => {
    const isDarkMode = useAtomValue(isDarkModeAtom);
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin h-40 w-40 border-primary border-4 border-t-transparent rounded-full"></div>
            <div>
                <input
                    type="checkbox"
                    value="dark"
                    checked={isDarkMode}
                    readOnly={true}
                    className="toggle theme-controller hidden"
                />
            </div>
        </div>
    );
};
