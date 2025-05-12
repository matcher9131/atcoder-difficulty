import type { ReactNode } from "react";
import { usePaginationBar } from "./usePaginationBar";
import type { PaginationKey } from "../../types/paginationKey";
import { PaginationBar } from "./PaginationBar";

type PaginationBarContainerProps = {
    readonly stateKey: PaginationKey;
    readonly scrollsToTop?: boolean;
};

export const PaginationBarContainer = ({ stateKey, scrollsToTop }: PaginationBarContainerProps): ReactNode => {
    const props = usePaginationBar(stateKey, scrollsToTop === true);
    return <PaginationBar {...props} />;
};
