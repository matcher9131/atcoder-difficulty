import clsx from "clsx";
import type { ChangeEventHandler, ReactNode, Ref } from "react";
import { useTranslation } from "react-i18next";

export type UserInputProps = {
    readonly inputRef: Ref<HTMLInputElement>;
    readonly handleChange: ChangeEventHandler<HTMLInputElement>;
    readonly validState: "none" | "success" | "error";
    readonly className?: string;
};

export const UserInput = ({ inputRef, handleChange, validState, className }: UserInputProps): ReactNode => {
    const labelStateClass = validState === "success" ? "input-success" : validState === "error" ? "input-error" : false;
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
        </div>
    );
};
