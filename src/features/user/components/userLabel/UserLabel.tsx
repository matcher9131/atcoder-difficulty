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
        <div className="w-full flex gap-x-3">
            <span>{`${t("userLabel.ratingLabel")}: ${rating ?? "-"}`}</span>
            <span>{`${t("userLabel.numContestsLabel")}: ${numContests ?? "-"}`}</span>
            {rawRating != null ? (
                <span>
                    {`${t("userLabel.rawRatingLabel")}: `}
                    <svg role="img" aria-label={t("userLabel.iconLabel")} className={clsx("w-6", "h-4", iconFillColor)}>
                        <use href={iconHref} />
                    </svg>
                    <span className={textColor}>{rawRating}</span>
                </span>
            ) : (
                <span>{`${t("userLabel.numContestsLabel")}: -`}</span>
            )}
        </div>
    );
};
