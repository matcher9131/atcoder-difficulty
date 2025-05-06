import clsx from "clsx";
import type { ReactNode } from "react";

export type PaginationBarProps = {
    readonly items: ReadonlyArray<{
        displayIndex: string;
        isSelected: boolean;
        onClick: () => void;
    }>;
    readonly onClickDecrement: () => void;
    readonly onClickIncrement: () => void;
};

export const PaginationBar = ({ items, onClickDecrement, onClickIncrement }: PaginationBarProps): ReactNode => {
    return (
        <div className="join">
            <button onClick={onClickDecrement} className="join-item btn btn-primary btn-outline">
                ⮘
            </button>
            {items.map(({ displayIndex, isSelected, onClick }) => (
                <button
                    key={displayIndex}
                    onClick={onClick}
                    className={clsx("join-item", "btn", "btn-primary", !isSelected && "btn-outline")}
                >
                    {displayIndex}
                </button>
            ))}
            <button onClick={onClickIncrement} className="join-item btn btn-primary btn-outline">
                ⮚
            </button>
        </div>
    );
};
