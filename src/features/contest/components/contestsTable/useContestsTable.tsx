import { useAtom } from "jotai";
import type { ContestType } from "../../types/contestType";
import { contestIdsByTypeAtom } from "../../dict/contests";
import type { ContestsTableProps } from "./ContestsTable";
import { ContestRowContainer } from "../contestRow";
import { getNumProblems } from "./funcitons";

export const useContestsTable = (contestType: ContestType): ContestsTableProps => {
    const numProblems = getNumProblems(contestType);
    const [contestIds] = useAtom(contestIdsByTypeAtom(contestType));
    const contestRows = contestIds.map((contestId) => (
        <ContestRowContainer key={contestId} contestId={contestId} numProblems={numProblems} />
    ));
    return { numProblems, contestRows };
};
