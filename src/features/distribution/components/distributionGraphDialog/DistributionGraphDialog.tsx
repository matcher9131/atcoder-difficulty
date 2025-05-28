import { type ReactNode } from "react";
import { ModalDialog, useModalDialog } from "../../../dialog/components/modalDialog";
import { DistributionGraphContainer } from "../distributionGraph/DistributionGraphContainer";
import { RemoveScroll } from "react-remove-scroll";

export const DistributionGraphDialog = (): ReactNode => {
    const { isOpen, setDialogElement, closeDialog } = useModalDialog("distribution");

    const handleClose = () => {
        closeDialog().catch(console.error);
    };

    return (
        <ModalDialog
            setDialogElement={setDialogElement}
            onClose={handleClose}
            outerClassName="w-4/5 h-4/5"
            innerClassName="px-6 py-4 h-full"
        >
            <RemoveScroll
                removeScrollBar
                enabled={isOpen}
                className="w-full h-full flex items-center justify-center relative"
            >
                <DistributionGraphContainer />
            </RemoveScroll>
        </ModalDialog>
    );
};
