import { useAtom } from "jotai";
import { problemSelector } from "../dict/problems";
import { getFillColor, getTextColor } from "./functions";
import type { ProblemViewProps } from "./ProblemView";

export const useProblemView = (problemId: string): ProblemViewProps => {
    const [problem] = useAtom(problemSelector(problemId));
    const { difficulty, displayName } = problem;
    const level =
        difficulty >= 3200 ? 4 : (Math.floor(difficulty / 50) % 4) + 1;
    const iconHref = `/resources/up_arrow_${level}.svg#up_arrow_${level}`;
    const fillColor = getFillColor(difficulty);
    const textColor = getTextColor(difficulty);
    const contestName = problemId.substring(0, problemId.lastIndexOf("_"));
    const linkHref = `https://atcoder.jp/contests/${contestName}/tasks/${problemId}`;
    return {
        fillColor,
        iconHref,
        difficulty,
        displayName,
        textColor,
        linkHref,
    };
};
