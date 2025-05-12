import { useAtom } from "jotai";
import { problemSelector } from "../../dict/problems";
import { getFillColor, getTextColor } from "./functions";
import type { ProblemCellProps } from "./ProblemCell";
import { splitProblemId } from "../../functions/split";

export const useProblemCell = (problemId: string): ProblemCellProps => {
    const [problem] = useAtom(problemSelector(problemId));
    const [, difficulty] = problem?.d ?? [null];
    const level = difficulty != null ? (difficulty >= 3200 ? 4 : (Math.floor(difficulty / 100) % 4) + 1) : 0;
    const iconHref = `/resources/up_arrow_${level}.svg#up_arrow_${level}`;
    const fillColor = difficulty != null ? getFillColor(difficulty) : "";
    const textColor = difficulty != null ? getTextColor(difficulty) : "";
    const [problemIdContest, problemIdProblem] = splitProblemId(problemId);
    const linkHref = `https://atcoder.jp/contests/${problemIdContest}/tasks/${problemIdProblem}`;
    return {
        fillColor,
        iconHref,
        difficulty: difficulty != null ? `${difficulty}` : "NaN",
        displayName: problem?.n ?? "",
        textColor,
        linkHref,
    };
};
