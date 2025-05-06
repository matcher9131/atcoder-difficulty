import { useAtom } from "jotai";
import type { ContestType } from "../../types/contestType";
import { contestIdsByTypeAtom } from "../../dict/contests";
import type { ContestsTableProps } from "./ContestsTable";
import { ContestRowContainer } from "../contestRow";
import { getNumProblems } from "./funcitons";
import { paginationValueAtom } from "../../../pagination/model/paginations";

export const useContestsTable = (contestType: ContestType): ContestsTableProps => {
    const numProblems = getNumProblems(contestType);
    const [contestIds] = useAtom(contestIdsByTypeAtom(contestType));
    const [pageIndex] = useAtom(paginationValueAtom(contestType));
    const contestRows = contestIds
        .slice(100 * pageIndex, 100 * (pageIndex + 1))
        .map((contestId) => <ContestRowContainer key={contestId} contestId={contestId} numProblems={numProblems} />);
    return { numProblems, contestRows };
};
