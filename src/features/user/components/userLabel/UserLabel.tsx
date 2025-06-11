import clsx from "clsx";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type UserLabelProps = {
    readonly rating: string | null;
    readonly numContests: string | null;
    readonly rawRating: string | null;
    readonly iconHref: string;
    readonly iconFillColor: string;
    readonly textColor: string;
};

export const UserLabel = ({
    rating,
    numContests,
    rawRating,
    iconHref,
    iconFillColor,
    textColor,
}: UserLabelProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full p-2 flex gap-x-3">
            <div>{`${t("userLabel.ratingLabel")}: ${rating ?? "-"}`}</div>
            <div>{`${t("userLabel.numContestsLabel")}: ${numContests ?? "-"}`}</div>
            {rawRating != null ? (
                <div className="flex items-center">
                    <div className="mr-1">{`${t("userLabel.rawRatingLabel")}:`}</div>
                    <svg
                        role="img"
                        aria-label={t("userLabel.iconLabel")}
                        className={clsx("w-6", "h-4", iconFillColor, "inline")}
                    >
                        <use href={iconHref} />
                    </svg>
                    <div className={textColor}>{rawRating}</div>
                </div>
            ) : (
                <div>{`${t("userLabel.rawRatingLabel")}: -`}</div>
            )}
        </div>
    );
};
