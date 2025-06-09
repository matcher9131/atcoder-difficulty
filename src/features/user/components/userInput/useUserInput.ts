import { type ChangeEvent, useRef } from "react";
import type { UserInputProps } from "./UserInput";
import { useAtom } from "jotai";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { userNameAtom, userNameValidationMessageAtom, userNameValidationStateAtom } from "../../models/username";
import { numContestsAtom, ratingAtom } from "../../../rating/models/rating";

const delay = 500;

export const useUserInput = (): Omit<UserInputProps, "classNames"> => {
    const [, setSolveProbabilityPaginationValue] = useAtom(paginationValueAtom("solveProbability"));

    const [userName, setUserName] = useAtom(userNameAtom);
    const [validationState, setValidationState] = useAtom(userNameValidationStateAtom);
    const [validationMessage, setValidationMessage] = useAtom(userNameValidationMessageAtom);
    const [, setRating] = useAtom(ratingAtom);
    const [, setNumContests] = useAtom(numContestsAtom);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<number | null>(null);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current);
        }
        const value = e.target.checkValidity() ? e.target.value : "";
        timeoutRef.current = window.setTimeout(() => {
            if (value === userName) return;
            setSolveProbabilityPaginationValue(0);
            setUserName(value);
            if (value === "") {
                setRating(null);
                setNumContests(null);
                setValidationState("none");
                setValidationMessage("");
                return;
            }
            fetch(import.meta.env.VITE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                },
                mode: "cors",
                body: JSON.stringify({ userName: value }),
            })
                .then((response) => {
                    if (response.ok) {
                        response
                            .text()
                            .then((text) => {
                                if (text == "null") {
                                    setRating(null);
                                    setNumContests(null);
                                    setValidationState("error");
                                    setValidationMessage("User not found.");
                                } else {
                                    const { rating, numContests } = JSON.parse(text) as {
                                        rating: number;
                                        numContests: number;
                                    };
                                    setRating(rating);
                                    setNumContests(numContests);
                                    setValidationState("success");
                                    setValidationMessage("");
                                }
                            })
                            .catch(console.log);
                    } else {
                        setRating(null);
                        setNumContests(null);
                        setValidationState("error");
                        setValidationMessage("Some errors occur.");
                    }
                })
                .catch(() => {
                    setRating(null);
                    setNumContests(null);
                    setValidationState("error");
                    setValidationMessage("Request Failed.");
                });
        }, delay);
    };

    return {
        inputRef,
        handleChange,
        validationState,
        validationMessage,
    };
};
