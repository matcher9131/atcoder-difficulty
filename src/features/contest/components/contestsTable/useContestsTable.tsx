import { useAtom } from "jotai";
import type { ContestType } from "../../types/contestType";
import { contestIdsByTypeAtom } from "../../dict/contests";
import type { ContestsTableProps } from "./ContestsTable";
import { ContestRowContainer } from "../contestRow";
import { getGridColsClassName, getNumProblems } from "../../functions/numProblems";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { ContestsTableHeader } from "../contestsTableHeader";
import { itemsPerPageAtom } from "../../../pagination/model/itemsPerPage";

export const useContestsTable = (contestType: ContestType): ContestsTableProps => {
    const numProblems = getNumProblems(contestType);
    const contestsTableHeader = <ContestsTableHeader numProblems={numProblems} />;
    const gridColsClassName = getGridColsClassName(contestType);
    const [contestIds] = useAtom(contestIdsByTypeAtom(contestType));
    const [pageIndex] = useAtom(paginationValueAtom(contestType));
    const [itemsPerPage] = useAtom(itemsPerPageAtom(contestType));
    const contestRows = contestIds
        .slice(itemsPerPage * pageIndex, itemsPerPage * (pageIndex + 1))
        .map((contestId) => <ContestRowContainer key={contestId} contestId={contestId} numProblems={numProblems} />);
    return { contestsTableHeader, gridColsClassName, contestRows };
};
