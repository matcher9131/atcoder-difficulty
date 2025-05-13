import type { ChangeEventHandler, ReactNode, Ref } from "react";

export type RatingInputProps = {
    readonly ratingInputRef: Ref<HTMLInputElement>;
    readonly handleRatingChange: ChangeEventHandler<HTMLInputElement>;
    readonly numContestsInputRef: Ref<HTMLInputElement>;
    readonly handleNumContestsChange: ChangeEventHandler<HTMLInputElement>;
};

export const RatingInput = ({
    ratingInputRef,
    handleRatingChange,
    numContestsInputRef,
    handleNumContestsChange,
}: RatingInputProps): ReactNode => {
    return (
        <div className="text-left flex gap-x-2">
            <label className="input input-lg validator w-48">
                <span className="text-sm">Rating</span>
                <input
                    type="text"
                    ref={ratingInputRef}
                    pattern="\d+"
                    title="Must be an integer"
                    onChange={handleRatingChange}
                    className="grow text-right"
                />
            </label>
            <label className="input input-lg validator w-48">
                <span className="text-sm">Num of matches</span>
                <input
                    type="text"
                    ref={numContestsInputRef}
                    pattern="\d+"
                    title="Must be an integer"
                    onChange={handleNumContestsChange}
                    className="grow text-right"
                />
            </label>
        </div>
    );
};
