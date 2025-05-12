import { useAtom } from "jotai";
import type { ContestType } from "../../types/contestType";
import { contestIdsByTypeAtom } from "../../dict/contests";
import type { ContestsTableProps } from "./ContestsTable";
import { ContestRowContainer } from "../contestRow";
import { getGridColsClassName, getNumProblems } from "./funcitons";
import { paginationValueAtom } from "../../../pagination/model/paginations";
import { ContestsTableHeader } from "../contestsTableHeader";

export const useContestsTable = (contestType: ContestType): ContestsTableProps => {
    const numProblems = getNumProblems(contestType);
    const contestsTableHeader = <ContestsTableHeader numProblems={numProblems} />;
    const gridColsClassName = getGridColsClassName(contestType);
    const [contestIds] = useAtom(contestIdsByTypeAtom(contestType));
    const [pageIndex] = useAtom(paginationValueAtom(contestType));
    const contestRows = contestIds
        .slice(100 * pageIndex, 100 * (pageIndex + 1))
        .map((contestId) => <ContestRowContainer key={contestId} contestId={contestId} numProblems={numProblems} />);
    return { contestsTableHeader, gridColsClassName, contestRows };
};
