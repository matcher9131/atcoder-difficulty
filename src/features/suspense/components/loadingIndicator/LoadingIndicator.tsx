import type { ReactNode } from "react";

export const LoadingIndicator = (): ReactNode => {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin h-40 w-40 border-primary border-4 border-t-transparent rounded-full"></div>
        </div>
    );
};
