import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const BlankTabContent = (): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
            <div className="w-full h-60 flex items-center justify-center text-lg">{t("blankTabContent.message")}</div>
        </div>
    );
};
