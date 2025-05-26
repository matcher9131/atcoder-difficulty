import { useCallback } from "react";
import { useAtom } from "jotai";
import { dialogIsOpenAtom, dialogElementAtom } from "../../models/dialog";

type UseModalDialogReturnType = {
    readonly isOpen: boolean;
    readonly setDialogElement: (element: HTMLDialogElement) => void;
    readonly closeDialog: () => Promise<void>;
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
            dialogElement.animate([{ transform: "scale(1)" }, { transform: "scale(0.5)" }], animationOptions);
            dialogElement.animate([{ opacity: 1 }, { opacity: 0 }], {
                pseudoElement: "::backdrop",
                ...animationOptions,
            });
            await Promise.allSettled(dialogElement.getAnimations().map(async (animation) => await animation.finished));
            dialogElement.close();
        }

        setOpen(false);
    }, [dialogElement]);

    return { isOpen, setDialogElement, closeDialog };
};
