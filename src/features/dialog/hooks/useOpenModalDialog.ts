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
            const bodyAnimation = dialogElement.animate(
                [{ transform: "scale(0.5)" }, { transform: "scale(1)" }],
                animationOptions,
            );
            // Some browsers do not support pseudo-element '::backdrop' in Element.animate,
            // so animate it only if the browser support it.
            let backdropAnimation: Animation | null = null;
            try {
                backdropAnimation = dialogElement.animate([{ opacity: 0 }, { opacity: 1 }], {
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
        }
    }, [dialogElement]);

    return { openDialog };
};
