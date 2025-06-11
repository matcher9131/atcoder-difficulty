import clsx from "clsx";
import type { ReactNode, Ref } from "react";
import { useTranslation } from "react-i18next";
import type { UserNameValidationState } from "../../types/userNameValidationState";

export type UserInputProps = {
    readonly inputRef: Ref<HTMLInputElement>;
    readonly buttonIsDisabled: boolean;
    readonly handleClick: () => void;
    readonly validationState: UserNameValidationState;
    readonly validationMessage: string;
    readonly className?: string;
};

export const UserInput = ({
    inputRef,
    buttonIsDisabled,
    handleClick,
    validationState,
    validationMessage,
    className,
}: UserInputProps): ReactNode => {
    const labelStateClass =
        validationState === "success" ? "input-success" : validationState === "error" ? "input-error" : false;
    const { t } = useTranslation();
    return (
        <div className={clsx("w-full", "pl-2", "text-left", "flex", "gap-x-2", "items-center", className)}>
            <label className={clsx("input", labelStateClass, "w-60")}>
                <span className="text-sm">{t("userInput.inputLabel")}</span>
                <input type="text" ref={inputRef} pattern="^[0-9A-Za-z_]+$" className="grow text-right" />
            </label>
            <button disabled={buttonIsDisabled} onClick={handleClick} className="btn btn-primary w-16">
                {buttonIsDisabled ? (
                    <div className="animate-spin h-4 w-4 border-primary border-1 border-t-transparent rounded-full"></div>
                ) : (
                    t("userInput.buttonLabel")
                )}
            </button>
            <div className="text-error">{validationMessage}</div>
        </div>
    );
};
