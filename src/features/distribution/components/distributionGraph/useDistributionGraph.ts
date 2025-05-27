import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";

export const useDistributionGraph = (): DistributionGraphProps => {
    const problemId = useAtomValue(selectedProblemAtom);
    const rawDistribution = useAtomValue(distributionAtom(problemId));

    const xMin = 0;
    const xMax = Math.floor((rawDistribution.length * 25) / 400) * 400;
    const labels = new Array((xMax - xMin) / 12.5).fill(0).map((_, i) => i * 12.5);
    const distributionData = new Array((xMax - xMin) / 25).fill(0).flatMap(
        (_, i): Array<{ readonly x: number; readonly y: number | null }> => [
            { x: i * 25, y: null },
            { x: i * 25 + 12.5, y: i < rawDistribution.length ? rawDistribution[i] : 0 },
        ],
    );
    const difficultyTuple = useAtomValue(problemSelector(problemId))?.d;
    const estimatedData =
        difficultyTuple != null
            ? new Array((xMax - xMin) / 25).fill(0).flatMap(
                  (_, i): Array<{ readonly x: number; readonly y: number | null }> => [
                      {
                          x: i * 25,
                          y: irt2pl(inverseAdjustmentOfLowRating(i * 25), difficultyTuple[0], difficultyTuple[1]) * 100,
                      },
                      { x: i * 25 + 12.5, y: null },
                  ],
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
                    backgroundColor: "red",
                },
                {
                    label: "Estimated Solve Probability",
                    data: estimatedData,
                    type: "line",
                    backgroundColor: "blue",
                },
            ],
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            // TODO: Implement
                            return `${tooltipItem.dataset.label}, ${tooltipItem.parsed.y}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    min: xMin,
                    max: xMax,
                    ticks: {
                        align: "start",
                        autoSkip: false,
                        callback: function (val, index) {
                            if (typeof val === "string") return undefined;
                            return index % 8 === 0 ? this.getLabelForValue(val) : undefined;
                        },
                    },
                    grid: {
                        offset: false,
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
