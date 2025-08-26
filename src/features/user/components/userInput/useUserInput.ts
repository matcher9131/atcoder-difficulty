import { useRef, useState } from "react";
import type { UserInputProps } from "./UserInput";
import { useAtom } from "jotai";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { userNameAtom, userNameValidationMessageAtom, userNameValidationStateAtom } from "../../models/username";
import { numContestsAtom, ratingAtom } from "../../../rating/models/atom";
import { fetchUser } from "./functions";
import { useTranslation } from "react-i18next";
import { UserNotFoundError } from "../../types/fetchUserError";

export const useUserInput = (): Omit<UserInputProps, "classNames"> => {
    const { t } = useTranslation();
    const [, setSolveProbabilityPaginationValue] = useAtom(paginationValueAtom("solveProbability"));

    const [userName, setUserName] = useAtom(userNameAtom);
    const [validationState, setValidationState] = useAtom(userNameValidationStateAtom);
    const [validationMessage, setValidationMessage] = useAtom(userNameValidationMessageAtom);
    const [, setRating] = useAtom(ratingAtom);
    const [, setNumContests] = useAtom(numContestsAtom);
    const inputRef = useRef<HTMLInputElement>(null);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    const handleClick = () => {
        const input = inputRef.current;
        if (input == null) return;

        const newUserName = input.value;
        if (newUserName === userName) return;

        setSolveProbabilityPaginationValue(0);
        if (newUserName === "") {
            setRating(null);
            setNumContests(null);
            setValidationState("none");
            setValidationMessage("");
            return;
        }

        setButtonIsDisabled(true);
        setUserName(newUserName);
        fetchUser(newUserName)
            .then(({ rating, numContests }) => {
                setRating(rating);
                setNumContests(numContests);
                setValidationState("success");
                setValidationMessage("");
            })
            .catch((error: unknown) => {
                setRating(null);
                setNumContests(null);
                setValidationState("error");
                setValidationMessage(
                    error instanceof UserNotFoundError
                        ? t("userInput.userNotFoundMessage")
                        : t("userInput.fetchUserErrorMessage"),
                );
            })
            .finally(() => {
                setButtonIsDisabled(false);
            });
    };

    return {
        inputRef,
        buttonIsDisabled,
        handleClick,
        validationState,
        validationMessage,
    };
};
