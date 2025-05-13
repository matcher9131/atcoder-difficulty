import { useAtom } from "jotai";
import { useRef, type ChangeEvent } from "react";
import { numContestsAtom, ratingAtom } from "../../../rating/models/rating";
import { parseIntOrNull } from "../../../../utils/number";
import type { SolveProbabilityTabContentProps } from "./SolveProbabilityTabContent";
import { PaginationBarContainer } from "../../../pagination/components/paginationBar";
import { SolveProbabilityTableContainer } from "../../../solveProbability/components/solveProbabilityTable";
import { ItemsPerPageSelectorContainer } from "../../../pagination/components/itemsPerPageSelector";

export const useSolveProbabilityTabContent = (): SolveProbabilityTabContentProps => {
    const [, setRating] = useAtom(ratingAtom);
    const ratingInputRef = useRef<HTMLInputElement>(null);
    const ratingTimeoutRef = useRef<number | null>(null);
    const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (ratingTimeoutRef.current != null) {
            clearTimeout(ratingTimeoutRef.current);
        }
        const value = e.target.checkValidity() ? parseIntOrNull(e.target.value) : null;
        ratingTimeoutRef.current = setTimeout(() => {
            setRating(value);
        }, 200);
    };

    const [, setNumContests] = useAtom(numContestsAtom);
    const numContestsInputRef = useRef<HTMLInputElement>(null);
    const numContestsTimeoutRef = useRef<number | null>(null);
    const handleNumContestsChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (numContestsTimeoutRef.current != null) {
            clearTimeout(numContestsTimeoutRef.current);
        }
        const value = parseIntOrNull(e.target.value);
        numContestsTimeoutRef.current = setTimeout(() => {
            setNumContests(value);
        }, 200);
    };

    const itemsPerPageSelector = <ItemsPerPageSelectorContainer stateKey="solveProbability" />;
    const headerPaginationBar = <PaginationBarContainer stateKey="solveProbability" />;
    const solveProbabilityTable = <SolveProbabilityTableContainer />;
    const footerPaginationBar = <PaginationBarContainer stateKey="solveProbability" scrollsToTop={true} />;

    return {
        ratingInputRef,
        handleRatingChange,
        numContestsInputRef,
        handleNumContestsChange,
        itemsPerPageSelector,
        headerPaginationBar,
        solveProbabilityTable,
        footerPaginationBar,
    };
};
