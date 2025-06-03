import { type ReactNode, type KeyboardEvent } from "react";
import { ModalDialog, useModalDialog } from "../../../dialog/components/modalDialog";
import { DistributionGraphContainer } from "../distributionGraph/DistributionGraphContainer";
import { RemoveScroll } from "react-remove-scroll";
import { ErrorBoundary } from "react-error-boundary";
import { DistributionGraphError } from "../distributionGraphError";

export const DistributionGraphDialog = (): ReactNode => {
    const { isOpen, setDialogElement, closeDialog, handleEscapeKeyDown } = useModalDialog("distribution");

    const handleClose = () => {
        closeDialog().catch(console.error);
    };
    const handleEspaceKeyDownSync = (e: KeyboardEvent<HTMLDialogElement>) => {
        handleEscapeKeyDown(e).catch(console.error);
    };

    return (
        <ModalDialog
            setDialogElement={setDialogElement}
            onClose={handleClose}
            onKeyDown={handleEspaceKeyDownSync}
            outerClassName="w-4/5 h-4/5"
            innerClassName="px-6 py-4 h-full"
        >
            <RemoveScroll
                removeScrollBar
                enabled={isOpen}
                className="w-full h-full flex items-center justify-center relative"
            >
                <ErrorBoundary FallbackComponent={DistributionGraphError}>
                    <DistributionGraphContainer />
                </ErrorBoundary>
            </RemoveScroll>
        </ModalDialog>
    );
};
