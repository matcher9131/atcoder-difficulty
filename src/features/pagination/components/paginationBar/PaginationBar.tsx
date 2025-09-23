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
        <div className="join pt-1">
            <button onClick={onClickDecrement} className="join-item btn btn-sm btn-primary btn-outline">
                ⮘
            </button>
            {items.map((item) => (
                <button
                    key={item.displayIndex}
                    onClick={item.onClick}
                    className={clsx("join-item", "btn", "btn-sm", "btn-primary", !item.isSelected && "btn-outline")}
                >
                    {item.displayIndex}
                </button>
            ))}
            <button onClick={onClickIncrement} className="join-item btn btn-sm btn-primary btn-outline">
                ⮚
            </button>
        </div>
    );
};
