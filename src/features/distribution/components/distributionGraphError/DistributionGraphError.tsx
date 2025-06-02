import type { ReactNode } from "react";
import type { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";

export const DistributionGraphError = ({ resetErrorBoundary }: FallbackProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-6">
            <div className="text-xl">{t("distributionGraphError.message")}</div>
            <button type="button" onClick={resetErrorBoundary} className="btn">
                {t("distributionGraphError.buttonLabel")}
            </button>
        </div>
    );
};
