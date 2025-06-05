import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const MainPageError = (): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full m-4 bg-base-200 items-center">
            <div className="text-4xl text-base-content my-3">{t("mainPageError.message")}</div>
        </div>
    );
};
