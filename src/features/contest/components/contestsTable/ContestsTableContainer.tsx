import type { ReactNode } from "react";
import type { ContestType } from "../../types/contestType";
import { useContestsTable } from "./useContestsTable";
import { ContestsTable } from "./ContestsTable";

type ContestsTableContainerProps = {
    readonly contestType: ContestType;
};

export const ContestsTableContainer = ({
    contestType,
}: ContestsTableContainerProps): ReactNode => {
    const props = useContestsTable(contestType);
    return <ContestsTable {...props} />;
};
