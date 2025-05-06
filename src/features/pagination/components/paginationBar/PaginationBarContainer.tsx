import type { ReactNode } from "react";
import { usePaginationBar } from "./usePaginationBar";
import type { PaginationKey } from "../../types/paginationKey";
import { PaginationBar } from "./PaginationBar";

type PaginationBarContainerProps = {
    stateKey: PaginationKey;
};

export const PaginationBarContainer = ({ stateKey }: PaginationBarContainerProps): ReactNode => {
    const props = usePaginationBar(stateKey);
    return <PaginationBar {...props} />;
};
