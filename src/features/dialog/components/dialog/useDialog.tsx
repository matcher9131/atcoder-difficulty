import { useCallback, useState, type ReactNode } from "react";
import { Dialog as DialogComponent } from "./Dialog";

type DialogProps = Omit<Parameters<typeof DialogComponent>[0], "isOpen" | "onClose" | "rootElement">;

type UseDialogReturnType = {
    readonly open: () => void;
    readonly close: () => void;
    readonly Dialog: (props: DialogProps) => ReactNode;
};

export const useDialog = (): UseDialogReturnType => {
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => {
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const Dialog = useCallback(
        (props: DialogProps): ReactNode => {
            return <DialogComponent isOpen={isOpen} onClose={close} {...props} />;
        },
        [close, isOpen],
    );

    return { open, close, Dialog };
};
