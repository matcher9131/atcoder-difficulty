import type { ChangeEventHandler, ReactNode, Ref } from "react";
import { SolveProbabilityTableContainer } from "../../../solveProbability/components/solveProbabilityTable";
import { PaginationBarContainer } from "../../../pagination/components/paginationBar";

export type SolveProbabilityTabContentProps = {
    readonly ratingInputRef: Ref<HTMLInputElement>;
    readonly handleRatingChange: ChangeEventHandler<HTMLInputElement>;
    readonly numContestsInputRef: Ref<HTMLInputElement>;
    readonly handleNumContestsChange: ChangeEventHandler<HTMLInputElement>;
};

export const SolveProbabilityTabContent = ({
    ratingInputRef,
    handleRatingChange,
    numContestsInputRef,
    handleNumContestsChange,
}: SolveProbabilityTabContentProps): ReactNode => {
    return (
        <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
            <div className="text-left flex gap-x-2">
                <label className="input input-lg validator w-48">
                    <span className="text-sm">Rating</span>
                    <input
                        type="text"
                        required
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
                        required
                        ref={numContestsInputRef}
                        pattern="\d+"
                        title="Must be an integer"
                        onChange={handleNumContestsChange}
                        className="grow text-right"
                    />
                </label>
            </div>
            <PaginationBarContainer stateKey="solveProbability" />
            <SolveProbabilityTableContainer />
            <PaginationBarContainer stateKey="solveProbability" />
        </div>
    );
};
