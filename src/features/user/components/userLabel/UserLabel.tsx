import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type UserLabelProps = {
    readonly rating: string | null;
    readonly numContests: string | null;
    readonly rawRatingWithIcon: ReactNode;
};

export const UserLabel = ({ rating, numContests, rawRatingWithIcon }: UserLabelProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full p-2 flex gap-x-3">
            <div>{`${t("userLabel.ratingLabel")}: ${rating ?? "-"}`}</div>
            <div>{`${t("userLabel.numContestsLabel")}: ${numContests ?? "-"}`}</div>
            <div className="flex items-center">
                <div className="mr-1">{`${t("userLabel.rawRatingLabel")}:`}</div>
                {rawRatingWithIcon}
            </div>
        </div>
    );
};
