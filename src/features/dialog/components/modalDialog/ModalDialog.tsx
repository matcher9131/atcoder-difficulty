import clsx from "clsx";
import { useCallback, type KeyboardEventHandler, type MouseEvent, type ReactNode } from "react";

type ModalDialogProps = {
    children: ReactNode;
    setDialogElement: (element: HTMLDialogElement) => void;
    onClose: () => void;
    onKeyDown: KeyboardEventHandler<HTMLDialogElement>;
    outerClassName?: string;
    innerClassName?: string;
};

export const ModalDialog = ({
    children,
    setDialogElement,
    onClose,
    onKeyDown,
    outerClassName,
    innerClassName,
}: ModalDialogProps): ReactNode => {
    const handleClickContent = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    return (
        <dialog
            ref={setDialogElement}
            onClick={onClose}
            onKeyDown={onKeyDown}
            className={clsx("m-auto", "backdrop:bg-base-content/50", outerClassName)}
        >
            <div onClick={handleClickContent} className={innerClassName}>
                {children}
            </div>
        </dialog>
    );
};
