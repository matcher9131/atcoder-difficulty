import { useAtom } from "jotai";
import { getProblemIndex, toPercent } from "./functions";
import type { ProblemCellProps } from "./ProblemCell";
import { splitProblemId } from "../../functions/split";
import { problemWithSolveProbabilityAtom } from "../../../solveProbability/models/solveProbabilities";
import { getFillColor, getTextColor } from "../../../rating/functions/color";

export const useProblemCell = (
    problemId: string,
    showsParameters: boolean,
    showsProblemIndex: boolean,
): ProblemCellProps => {
    const [problem] = useAtom(problemWithSolveProbabilityAtom(problemId));
    if (problem == null) throw new Error(`Invalid problemId = ${problemId}`);
    const [, difficulty] = problem.d ?? [null];
    const level = difficulty != null ? (difficulty >= 3200 ? 4 : (Math.floor(difficulty / 100) % 4) + 1) : 0;
    const iconHref =
        (import.meta.env.PROD ? "/atcoder-difficulty" : "") +
        `/resources/up_arrow_${level.toString()}.svg#up_arrow_${level.toString()}`;
    const fillColor = difficulty != null ? getFillColor(difficulty) : "";
    const textColor = difficulty != null ? getTextColor(difficulty) : "";
    const [problemIdContest, problemIdProblem] = splitProblemId(problemId);
    const linkHref = `https://atcoder.jp/contests/${problemIdContest}/tasks/${problemIdProblem}`;
    return {
        fillColor,
        iconHref,
        difficulty: showsParameters ? (difficulty?.toString() ?? "NaN") : "",
        solveProbability: showsParameters ? toPercent(problem.solveProbability) : "",
        displayName: problem.n,
        textColor,
        linkHref,
        ...(showsProblemIndex ? { problemIndex: getProblemIndex(problemId) } : {}),
    };
};
