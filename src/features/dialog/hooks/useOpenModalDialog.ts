import { useAtom, useAtomValue } from "jotai";
import { dialogElementAtom, dialogIsOpenAtom } from "../models/dialog";
import { useCallback } from "react";

type UseOpenModalDialogReturnType = {
    readonly openDialog: () => Promise<void>;
};

export const useOpenModalDialog = (id: string): UseOpenModalDialogReturnType => {
    const [, setIsOpen] = useAtom(dialogIsOpenAtom(id));
    const dialogElement = useAtomValue(dialogElementAtom(id));

    const openDialog = useCallback(async () => {
        setIsOpen(true);
        if (dialogElement != null) {
            dialogElement.showModal();
            const animationOptions = {
                duration: 200,
                iteration: 1,
            };
            dialogElement.animate([{ transform: "scale(0.5)" }, { transform: "scale(1)" }], animationOptions);
            dialogElement.animate([{ opacity: 0 }, { opacity: 1 }], {
                pseudoElement: "::backdrop",
                ...animationOptions,
            });
            await Promise.allSettled(dialogElement.getAnimations().map(async (animation) => await animation.finished));
        }
    }, [dialogElement]);

    return { openDialog };
};
