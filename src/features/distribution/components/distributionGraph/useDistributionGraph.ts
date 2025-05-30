import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";
import { useCallback } from "react";
import { splitProblemId } from "../../../problem/functions/split";
import { capitalize } from "../../../../utils/string";
import { useTranslation } from "react-i18next";
import type { TooltipItem } from "chart.js";

const classToDisplay = (infimum: number): string => {
    return `${infimum.toString()} - ${(infimum + 25).toString()}`;
};

const percentToDisplay = (percent: number): string => {
    return percent >= 99.5 ? ">99%" : percent < 0.5 ? "<1%" : `${percent.toFixed(0)}%`;
};

export const problemIdToDisplayText = (problemId: string, problemName: string): string => {
    const [contestId, innerProblemId] = splitProblemId(problemId);
    const problemIndex = capitalize(innerProblemId.substring(innerProblemId.lastIndexOf("_") + 1));
    return `${contestId.toUpperCase()} ${problemIndex} - ${problemName}`;
};

export const useDistributionGraph = (): DistributionGraphProps => {
    const { t } = useTranslation();

    const problemId = useAtomValue(selectedProblemAtom);
    const rawDistribution = useAtomValue(distributionAtom(problemId));
    const problemName = useAtomValue(problemSelector(problemId))?.n ?? "";

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
    const tooltipCallbackTitle = useCallback((tooltipItems: TooltipItem<"bar" | "line">[]) => {
        const tooltipItem = tooltipItems[0];
        const labels = (tooltipItem.chart.data.labels ?? []) as number[];
        const label = labels[tooltipItem.dataIndex];
        return `${t("distributionGraph.xLabel")}: ${tooltipItem.datasetIndex === 0 ? classToDisplay(label) : label.toString()}`;
    }, []);
    const tooltipCallbackLabel = useCallback((tooltipItem: TooltipItem<"bar" | "line">) => {
        return `${tooltipItem.dataset.label ?? ""}: ${tooltipItem.datasetIndex === 0 ? `${tooltipItem.parsed.y.toString()}%` : percentToDisplay(tooltipItem.parsed.y)}`;
    }, []);

    return {
        data: {
            labels,
            datasets: [
                {
                    label: t("distributionGraph.yLabels.barDatasetLabel"),
                    data: distributionData,
                    type: "bar",
                    barPercentage: 1.8,
                    backgroundColor: "rgba(104, 96, 251, 0.7)",
                },
                {
                    label: t("distributionGraph.yLabels.lineDatasetLabel"),
                    data: estimatedData,
                    type: "line",
                    spanGaps: true,
                    cubicInterpolationMode: "monotone",
                    // styles for line
                    borderColor: "rgba(241, 54, 152, 0.8)",
                    backgroundColor: "rgba(241, 54, 152, 1)",
                    // styles for point (for legend, not visible in chart)
                    pointRadius: 0,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "rgba(241, 54, 152, 0.8)",
                    // styles for hovering point
                    pointHitRadius: 2,
                    pointHoverRadius: 4,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: problemIdToDisplayText(problemId, problemName),
                    font: {
                        size: 20,
                    },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: tooltipCallbackTitle,
                        label: tooltipCallbackLabel,
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
                        text: t("distributionGraph.xLabel"),
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
                        text: t("distributionGraph.yLabels.axisLabel"),
                        font: {
                            size: 16,
                        },
                    },
                },
            },
        },
    };
};
