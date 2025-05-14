import clsx from "clsx";
import type { ChangeEventHandler, ReactNode, Ref } from "react";
import { useTranslation } from "react-i18next";

export type RatingInputProps = {
    readonly ratingInputRef: Ref<HTMLInputElement>;
    readonly handleRatingChange: ChangeEventHandler<HTMLInputElement>;
    readonly numContestsInputRef: Ref<HTMLInputElement>;
    readonly handleNumContestsChange: ChangeEventHandler<HTMLInputElement>;
    readonly className?: string;
};

export const RatingInput = ({
    ratingInputRef,
    handleRatingChange,
    numContestsInputRef,
    handleNumContestsChange,
    className,
}: RatingInputProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className={clsx("text-left", "flex", "gap-x-2", className)}>
            <label className="input input-lg validator w-48">
                <span className="text-sm">{t("ratingInput.ratingLabel")}</span>
                <input
                    type="text"
                    ref={ratingInputRef}
                    pattern="\d+"
                    title={t("ratingInput.validationMessage")}
                    onChange={handleRatingChange}
                    className="grow text-right"
                />
            </label>
            <label className="input input-lg validator w-48">
                <span className="text-sm">{t("ratingInput.numContestsLabel")}</span>
                <input
                    type="text"
                    ref={numContestsInputRef}
                    pattern="\d+"
                    title={t("ratingInput.validationMessage")}
                    onChange={handleNumContestsChange}
                    className="grow text-right"
                />
            </label>
        </div>
    );
};
