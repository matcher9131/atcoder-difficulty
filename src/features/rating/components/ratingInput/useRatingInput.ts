import { useAtom } from "jotai";
import { numContestsAtom, ratingAtom } from "../../models/rating";
import { useEffect, useRef, type ChangeEvent } from "react";
import { parseIntOrNull } from "../../../../utils/number";
import type { RatingInputProps } from "./RatingInput";
import { paginationValueAtom } from "../../../pagination/model/paginations";

const delay = 500;

export const useRatingInput = (): RatingInputProps => {
    const [, setSolveProbabilityPaginationValue] = useAtom(paginationValueAtom("solveProbability"));

    const [rating, setRating] = useAtom(ratingAtom);
    const ratingInputRef = useRef<HTMLInputElement>(null);
    const ratingTimeoutRef = useRef<number | null>(null);
    const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (ratingTimeoutRef.current != null) {
            clearTimeout(ratingTimeoutRef.current);
        }
        const value = e.target.checkValidity() ? parseIntOrNull(e.target.value) : null;
        ratingTimeoutRef.current = window.setTimeout(() => {
            if (value !== rating) {
                setSolveProbabilityPaginationValue(0);
                setRating(value);
            }
        }, delay);
    };

    const [numContests, setNumContests] = useAtom(numContestsAtom);
    const numContestsInputRef = useRef<HTMLInputElement>(null);
    const numContestsTimeoutRef = useRef<number | null>(null);
    const handleNumContestsChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (numContestsTimeoutRef.current != null) {
            clearTimeout(numContestsTimeoutRef.current);
        }
        const value = e.target.checkValidity() ? parseIntOrNull(e.target.value) : null;
        numContestsTimeoutRef.current = window.setTimeout(() => {
            if (value !== numContests) {
                setSolveProbabilityPaginationValue(0);
                setNumContests(value);
            }
        }, delay);
    };

    useEffect(() => {
        if (ratingInputRef.current != null) {
            ratingInputRef.current.value = `${rating ?? ""}`;
        }
        if (numContestsInputRef.current != null) {
            numContestsInputRef.current.value = `${numContests ?? ""}`;
        }
    }, []); // No dependency to run only after initial render

    return {
        ratingInputRef,
        handleRatingChange,
        numContestsInputRef,
        handleNumContestsChange,
    };
};
