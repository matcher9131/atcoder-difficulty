import clsx from "clsx";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type RatingWithIconProps = {
    readonly iconHref: string;
    readonly iconFillColor: string;
    readonly textColor: string;
    readonly rating: number;
};

const RatingWithIcon = ({ iconHref, iconFillColor, textColor, rating }: RatingWithIconProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <>
            <svg
                role="img"
                aria-label={t("ratingWithIcon.iconLabel")}
                className={clsx("w-6", "h-4", iconFillColor, "inline")}
            >
                <use href={iconHref} />
            </svg>
            <div className={textColor}>{rating}</div>
        </>
    );
};

export default RatingWithIcon;
