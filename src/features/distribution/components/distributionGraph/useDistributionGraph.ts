import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";
import { problemSelector } from "../../../problem/dict/problems";
import { irt2pl } from "../../../solveProbability/models/functions";
import { inverseAdjustmentOfLowRating } from "../../../rating/models/functions";
import { useState } from "react";
import type { DistributionGraphTooltipProps } from "../distributionGraphTooltip/DistributionGraphTooltip";
import { parseIntOrNull } from "../../../../utils/number";
import { splitProblemId } from "../../../problem/functions/split";
import { capitalize } from "../../../../utils/string";
import { useTranslation } from "react-i18next";

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
    const [tooltipTexts, setTooltipTexts] = useState<DistributionGraphTooltipProps["texts"]>({
        xLabel: "",
        xValue: "",
        yLabel: "",
        yValue: "",
    });
    const [tooltipStyle, setTooltipStyle] = useState<DistributionGraphTooltipProps["style"]>({
        opacity: 0,
        left: undefined,
        right: undefined,
        top: undefined,
    });

    return {
        data: {
            labels,
            datasets: [
                {
                    label: t("distributionGraph.yLabels.barDatasetLabel"),
                    data: distributionData,
                    type: "bar",
                    barPercentage: 1.6,
                    backgroundColor: "rgba(104, 96, 251, 0.7)",
                },
                {
                    label: t("distributionGraph.yLabels.lineDatasetLabel"),
                    data: estimatedData,
                    type: "line",
                    spanGaps: true,
                    cubicInterpolationMode: "monotone",
                    pointHitRadius: 2,
                    pointHoverRadius: 5,
                    borderColor: "rgba(241, 54, 152, 0.8)",
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "transparent",
                    pointHoverBorderColor: "rgba(241, 54, 152, 0.8)",
                    pointHoverBorderWidth: 1,
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
                    enabled: false,
                    external: ({ chart, tooltip }) => {
                        if (tooltip.opacity === 0) {
                            setTooltipStyle({ ...tooltipStyle, opacity: 0 });
                            return;
                        }

                        const newTooltipTexts = {
                            xLabel: t("distributionGraph.xLabel"),
                            xValue:
                                tooltip.dataPoints[0].datasetIndex === 0
                                    ? classToDisplay(parseIntOrNull(tooltip.title[0]) ?? 0)
                                    : tooltip.title[0],
                            yLabel: tooltip.dataPoints[0].dataset.label ?? "",
                            yValue:
                                tooltip.dataPoints[0].datasetIndex === 0
                                    ? `${tooltip.dataPoints[0].parsed.y.toString()}%`
                                    : percentToDisplay(tooltip.dataPoints[0].parsed.y),
                        };

                        // Supress unnecessary update
                        if (
                            tooltipStyle.opacity === 0 ||
                            Object.keys(newTooltipTexts).some(
                                (key) =>
                                    (tooltipTexts as Record<string, string>)[key] !==
                                    (newTooltipTexts as Record<string, string>)[key],
                            )
                        ) {
                            const { offsetLeft, offsetTop, width: canvasWidth } = chart.canvas;

                            setTooltipTexts(newTooltipTexts);
                            setTooltipStyle({
                                opacity: 1,
                                left: tooltip.caretX <= canvasWidth / 2 ? offsetLeft + tooltip.caretX : undefined,
                                right: tooltip.caretX > canvasWidth / 2 ? canvasWidth - tooltip.caretX : undefined,
                                top: offsetTop + tooltip.caretY - tooltip.height / 2,
                            });
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
        tooltipStyle,
        tooltipTexts,
    };
};
