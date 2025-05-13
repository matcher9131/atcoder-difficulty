import { useAtom } from "jotai";
import { numContestsAtom, ratingAtom } from "../../models/rating";
import { useRef, type ChangeEvent } from "react";
import { parseIntOrNull } from "../../../../utils/number";
import type { RatingInputProps } from "./RatingInput";

export const useRatingInput = (): RatingInputProps => {
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

    return {
        ratingInputRef,
        handleRatingChange,
        numContestsInputRef,
        handleNumContestsChange,
    };
};
