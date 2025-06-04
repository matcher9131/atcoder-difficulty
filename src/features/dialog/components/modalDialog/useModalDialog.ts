import { useCallback, type KeyboardEvent } from "react";
import { useAtom } from "jotai";
import { dialogIsOpenAtom, dialogElementAtom } from "../../models/dialog";

type UseModalDialogReturnType = {
    readonly isOpen: boolean;
    readonly setDialogElement: (element: HTMLDialogElement) => void;
    readonly closeDialog: () => Promise<void>;
    readonly handleEscapeKeyDown: (e: KeyboardEvent<HTMLDialogElement>) => Promise<void>;
};

export const useModalDialog = (id: string): UseModalDialogReturnType => {
    const [isOpen, setOpen] = useAtom(dialogIsOpenAtom(id));
    const [dialogElement, setDialogElement] = useAtom(dialogElementAtom(id));

    const closeDialog = useCallback(async () => {
        if (dialogElement != null) {
            const animationOptions = {
                duration: 100,
                iteration: 1,
            };
            const bodyAnimation = dialogElement.animate(
                [{ transform: "scale(1)" }, { transform: "scale(0.5)" }],
                animationOptions,
            );
            // Some browsers do not support pseudo-element '::backdrop' in Element.animate,
            // so animate it only if the browser support it.
            let backdropAnimation: Animation | null = null;
            try {
                backdropAnimation = dialogElement.animate([{ opacity: 1 }, { opacity: 0 }], {
                    pseudoElement: "::backdrop",
                    ...animationOptions,
                });
            } catch {
                backdropAnimation = null;
            }

            await bodyAnimation.finished;
            if (backdropAnimation != null) {
                await backdropAnimation.finished;
            }

            dialogElement.close();
        }

        setOpen(false);
    }, [dialogElement]);

    const handleEscapeKeyDown = useCallback(
        async (e: KeyboardEvent<HTMLDialogElement>) => {
            if (e.key === "Escape") {
                e.preventDefault();
                await closeDialog();
            }
        },
        [dialogElement],
    );

    return { isOpen, setDialogElement, closeDialog, handleEscapeKeyDown };
};
