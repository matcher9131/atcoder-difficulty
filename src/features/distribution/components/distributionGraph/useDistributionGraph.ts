import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";
import { useState } from "react";
import type { DistributionGraphTooltipProps } from "../distributionGraphTooltip/DistributionGraphTooltip";

const percentToDisplay = (percent: number): string => {
    return percent >= 99.5 ? ">99%" : percent < 0.5 ? "<1%" : `${percent.toFixed(0)} %`;
};

export const useDistributionGraph = (): DistributionGraphProps => {
    const problemId = useAtomValue(selectedProblemAtom);
    const rawDistribution = useAtomValue(distributionAtom(problemId));

    const xMin = 0;
    const xMax = Math.floor((rawDistribution.length * 25) / 400) * 400;
    const labels = new Array((xMax - xMin) / 25).fill(0).flatMap((_, i) => [i * 25, i * 25]);
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

    // For custom tooltip
    const [tooltipOpacity, setTooltipOpacity] = useState(0);
    const [tooltipProps, setTooltipProps] = useState<Omit<DistributionGraphTooltipProps, "opacity">>({
        xLabel: "",
        xValue: "",
        yLabel: "",
        yValue: "",
    });

    return {
        data: {
            labels,
            datasets: [
                {
                    label: "Actual Solve Probability",
                    data: distributionData,
                    type: "bar",
                    barPercentage: 1.6,
                    backgroundColor: "rgba(104, 96, 251, 0.7)",
                },
                {
                    label: "Estimated Solve Probability",
                    data: estimatedData,
                    type: "line",
                    spanGaps: true,
                    cubicInterpolationMode: "monotone",
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderColor: "rgba(241, 54, 152, 0.8)",
                },
            ],
        },
        options: {
            plugins: {
                tooltip: {
                    enabled: false,
                    external: ({ tooltip }) => {
                        if (tooltip.opacity === 0) {
                            setTooltipOpacity(0);
                            return;
                        }

                        const newTooltipProps = {
                            xLabel: "Rating",
                            xValue: tooltip.title[0],
                            yLabel: tooltip.dataPoints[0].dataset.label ?? "",
                            yValue:
                                tooltip.dataPoints[0].datasetIndex === 0
                                    ? `${tooltip.dataPoints[0].parsed.y.toString()}%`
                                    : percentToDisplay(tooltip.dataPoints[0].parsed.y),
                        };

                        // Supress unnecessary update
                        if (
                            tooltipOpacity === 0 ||
                            Object.keys(newTooltipProps).some(
                                (key) =>
                                    (tooltipProps as Record<string, string>)[key] !==
                                    (newTooltipProps as Record<string, string>)[key],
                            )
                        ) {
                            setTooltipProps(newTooltipProps);
                            setTooltipOpacity(1);
                        }
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
                    title: {
                        display: true,
                        text: "Rating",
                        font: {
                            size: 16,
                        },
                    },
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                    title: {
                        display: true,
                        text: "Solve Probability (%)",
                        font: {
                            size: 16,
                        },
                    },
                },
            },
        },
        tooltipOpacity,
        tooltipProps,
    };
};
