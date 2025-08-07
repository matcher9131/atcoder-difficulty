import type { ReactNode } from "react";
// import { useTranslation } from "react-i18next";

export const ContestStatsError = (): ReactNode => {
    // const { t } = useTranslation();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-6">
            <div className="text-xl">Failed loading</div>
        </div>
    );
};
