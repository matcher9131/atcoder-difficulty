import { useRef, type ChangeEvent } from "react";
import type { UserInputProps } from "./UserInput";
import { useAtom } from "jotai";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { userNameAtom } from "../../models/username";

const delay = 500;

export const useUserInput = (): Omit<UserInputProps, "classNames"> => {
    const [, setSolveProbabilityPaginationValue] = useAtom(paginationValueAtom("solveProbability"));

    const [userName, setUserName] = useAtom(userNameAtom);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<number | null>(null);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current);
        }
        const value = e.target.checkValidity() ? e.target.value : "";
        timeoutRef.current = window.setTimeout(() => {
            if (value !== userName) {
                setSolveProbabilityPaginationValue(0);
                setUserName(value);
                // TODO: update ratingAtom
            }
        }, delay);
    };

    return {
        inputRef,
        handleChange,
        validState: "success", // TODO: set proper validState
    };
};
