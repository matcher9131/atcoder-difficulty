import { useAtom } from "jotai";
import { getFillColor, getProblemIndex, getTextColor } from "./functions";
import type { ProblemCellProps } from "./ProblemCell";
import { splitProblemId } from "../../functions/split";
import { problemWithSolveProbabilityAtom } from "../../../solveProbability/models/solveProbabilities";

const solveProbabilityToPercent = (x: number): string => {
    if (x > 1) return "";
    if (x < 0) return "NaN";
    return `${(100 * x).toFixed(1)}%`;
};

export const useProblemCell = (
    problemId: string,
    showsParameters: boolean,
    showsProblemIndex: boolean,
): ProblemCellProps => {
    const [problem] = useAtom(problemWithSolveProbabilityAtom(problemId));
    if (problem == null) throw new Error(`Invalid problemId = ${problemId}`);
    const [, difficulty] = problem.d ?? [null];
    const level = difficulty != null ? (difficulty >= 3200 ? 4 : (Math.floor(difficulty / 100) % 4) + 1) : 0;
    const iconHref = `/resources/up_arrow_${level}.svg#up_arrow_${level}`;
    const fillColor = difficulty != null ? getFillColor(difficulty) : "";
    const textColor = difficulty != null ? getTextColor(difficulty) : "";
    const [problemIdContest, problemIdProblem] = splitProblemId(problemId);
    const linkHref = `https://atcoder.jp/contests/${problemIdContest}/tasks/${problemIdProblem}`;
    return {
        fillColor,
        iconHref,
        difficulty: showsParameters ? `${difficulty ?? "NaN"}` : "",
        solveProbability: showsParameters ? solveProbabilityToPercent(problem.solveProbability) : "",
        displayName: problem.n,
        textColor,
        linkHref,
        ...(showsProblemIndex ? { problemIndex: getProblemIndex(problemId) } : {}),
    };
};
