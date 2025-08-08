import { Suspense, type ErrorInfo, type KeyboardEvent, type ReactNode } from "react";
import { ModalDialog, useModalDialog } from "../../../dialog/components/modalDialog";
import { RemoveScroll } from "react-remove-scroll";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingIndicator } from "../../../suspense/components/loadingIndicator";
import { ContestStatsTab } from "../contestStatsTab";
import { ContestStatsError } from "../contestStatsError";

const logError =
    (logId: string) =>
    (error: Error, info: ErrorInfo): void => {
        console.error(`[${logId}]`, error, info.componentStack);
    };

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
            innerClassName="px-6 py-4 flex h-full"
        >
            <RemoveScroll enabled={isOpen} className="grow overflow-y-auto">
                <ErrorBoundary
                    FallbackComponent={ContestStatsError}
                    onError={import.meta.env.DEV ? logError("ContestStatsDialog") : undefined}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <ContestStatsTab />
                    </Suspense>
                </ErrorBoundary>
            </RemoveScroll>
        </ModalDialog>
    );
};
