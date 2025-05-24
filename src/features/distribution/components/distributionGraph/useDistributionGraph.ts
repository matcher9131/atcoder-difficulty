import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";

export const useDistributionGraph = (): DistributionGraphProps => {
    const problemId = useAtomValue(selectedProblemAtom);
    const distribution = useAtomValue(distributionAtom(problemId));
    const labels = new Array(distribution.length).fill(0).map((_, i) => i * 25);
    const distributionData = Array.from(distribution, (frequency, i) => [i * 25 + 12.5, frequency] as [number, number]);
    const difficultyTuple = useAtomValue(problemSelector(problemId))?.d;
    const estimatedData =
        difficultyTuple != null
            ? labels.map(
                  (rating) =>
                      [
                          rating,
                          irt2pl(inverseAdjustmentOfLowRating(rating), difficultyTuple[0], difficultyTuple[1]),
                      ] as [number, number],
              )
            : [];
    return {
        data: {
            labels,
            datasets: [
                {
                    label: "Actual Solve Probability",
                    data: distributionData,
                    type: "bar",
                },
                {
                    label: "Estimated Solve Probability",
                    data: estimatedData,
                    type: "line",
                },
            ],
        },
        options: {
            scales: {
                x: {
                    min: 0,
                    max: ((labels.length + 3) / 4) * 100,
                    ticks: {
                        stepSize: 100,
                    },
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                },
            },
        },
    };
};
