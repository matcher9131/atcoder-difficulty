import { Suspense, type KeyboardEvent, type ReactNode } from "react";
import { ModalDialog, useModalDialog } from "../../../dialog/components/modalDialog";
import { RemoveScroll } from "react-remove-scroll";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingIndicator } from "../../../suspense/components/loadingIndicator";
import { ContestStatsTab } from "../contestStatsTab";
import { ContestStatsError } from "../contestStatsError";

export const ContestStatsDialog = (): ReactNode => {
    const { isOpen, setDialogElement, closeDialog, handleEscapeKeyDown } = useModalDialog("contestStats");

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
                <ErrorBoundary FallbackComponent={ContestStatsError}>
                    <Suspense fallback={<LoadingIndicator />}>
                        <ContestStatsTab />
                    </Suspense>
                </ErrorBoundary>
            </RemoveScroll>
        </ModalDialog>
    );
};
