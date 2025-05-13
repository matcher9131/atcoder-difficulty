import clsx from "clsx";
import type { ReactNode } from "react";

export type ItemsPerPageSelectorProps = {
    readonly items: ReadonlyArray<{
        readonly text: string;
        readonly isSelected: boolean;
        readonly onClick: () => void;
    }>;
};

export const ItemsPerPageSelector = ({ items }: ItemsPerPageSelectorProps): ReactNode => {
    return (
        <div className="flex items-baseline gap-x-2">
            <div>Items per page: </div>
            <div className="flex">
                {items.map(({ text, isSelected, onClick }) => (
                    <button
                        key={text}
                        onClick={onClick}
                        className={clsx("btn", "btn-sm", isSelected ? "btn-soft" : "btn-ghost")}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );
};
