import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { RemoveScroll } from "react-remove-scroll";

type DialogProps = {
    children: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
};

export const Dialog = ({ children, isOpen, onClose }: DialogProps): ReactNode => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialogElement = dialogRef.current;
        if (dialogElement == null) return;
        if (isOpen === true) {
            if (!dialogElement.hasAttribute("open")) {
                dialogElement.showModal();
            }
        } else {
            if (dialogElement.hasAttribute("open")) {
                dialogElement.close();
            }
        }
    }, [isOpen]);

    const handleClickDialog = useCallback(() => {
        onClose?.();
    }, [onClose]);

    const handleClickContent = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    return (
        <RemoveScroll removeScrollBar enabled={isOpen}>
            <dialog
                ref={dialogRef}
                onClick={handleClickDialog}
                className="p-0 backdrop:opacity-0 backdrop:bg-black/50 open:backdrop:opacity-1 transition-opacity"
            >
                <div onClick={handleClickContent} className="p-1">
                    {children}
                </div>
            </dialog>
        </RemoveScroll>
    );
};
