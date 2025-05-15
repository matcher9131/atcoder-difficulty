import { useAtom } from "jotai";
import { ratingAtom } from "../../../rating/models/rating";
import { BlankTabContent } from "../blankTabContent/BlankTabContent";
import { SolveProbabilityTabContentContainer } from "../solveProbabilityTabContent";
import type { ProblemsTabProps } from "./ProblemsTab";

export const useProblemTab = (): ProblemsTabProps => {
    const [rating] = useAtom(ratingAtom);
    return {
        solveProbabilityTabContent: rating == null ? <BlankTabContent /> : <SolveProbabilityTabContentContainer />,
    };
};
