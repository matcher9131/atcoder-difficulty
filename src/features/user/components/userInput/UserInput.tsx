import clsx from "clsx";
import type { ChangeEventHandler, ReactNode, Ref } from "react";
import { useTranslation } from "react-i18next";
import type { UserNameValidationState } from "../../types/userNameValidationState";

export type UserInputProps = {
    readonly inputRef: Ref<HTMLInputElement>;
    readonly handleChange: ChangeEventHandler<HTMLInputElement>;
    readonly validationState: UserNameValidationState;
    readonly validationMessage: string;
    readonly className?: string;
};

export const UserInput = ({
    inputRef,
    handleChange,
    validationState,
    validationMessage,
    className,
}: UserInputProps): ReactNode => {
    const labelStateClass =
        validationState === "success" ? "input-success" : validationState === "error" ? "input-error" : false;
    const { t } = useTranslation();
    return (
        <div className={clsx("text-left", "flex", "gap-x-2", className)}>
            <label className={clsx("input", labelStateClass, "w-60")}>
                <span className="text-sm">{t("userInput.label")}</span>
                <input
                    type="text"
                    ref={inputRef}
                    pattern="^[0-9A-Za-z_]+$"
                    onChange={handleChange}
                    className="grow text-right"
                />
            </label>
            <span className="text-error">{validationMessage}</span>
        </div>
    );
};
