import { range } from "../../../../utils/array";
import { roundToOneDigit } from "../../../../utils/number";

export type ContestDistributionGraphData = {
    readonly ratedDistributionData: Array<{ readonly x: number; readonly y: number }>;
    readonly unratedDistributionData: Array<{ readonly x: number; readonly y: number }>;
    readonly xMin: number;
    readonly xMax: number;
    readonly yMin: number;
    readonly yMax: number;
    readonly yStep: number;
};

export const createGraphDataLinear = (
    ratedDistribution: readonly number[],
    unratedDistribution: readonly number[],
): ContestDistributionGraphData => {
    const dataLength = Math.max(ratedDistribution.length, unratedDistribution.length);
    const ratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    const unratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    for (let i = 0; i < dataLength; ++i) {
        ratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < ratedDistribution.length ? ratedDistribution[i] : 0,
        });
        unratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < unratedDistribution.length ? unratedDistribution[i] : 0,
        });
    }

    const xMin = 0;
    const xMax =
        Math.max(ratedDistribution.length, unratedDistribution.length) * 25 <= 3200
            ? 3200
            : Math.ceil((Math.max(ratedDistribution.length, unratedDistribution.length) * 25) / 100) * 100;
    const yMin = 0;
    const rawYMax = range(0, dataLength).reduce(
        (acc, _, i) => Math.max(acc, ratedDistributionData[i].y + unratedDistributionData[i].y),
        0,
    );
    const yStep = roundToOneDigit(rawYMax / 10);
    const yMax = Math.ceil(rawYMax / yStep) * yStep;

    return {
        ratedDistributionData,
        unratedDistributionData,
        xMin,
        xMax,
        yMin,
        yMax,
        yStep,
    };
};

const toLogarithmic = (x: number): number => {
    return Math.log2(x) + 1;
};

export const createGraphDataLog = (
    ratedDistribution: readonly number[],
    unratedDistribution: readonly number[],
): ContestDistributionGraphData => {
    const dataLength = Math.max(ratedDistribution.length, unratedDistribution.length);
    const ratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    const unratedDistributionData: Array<{ readonly x: number; readonly y: number }> = [];
    for (let i = 0; i < dataLength; ++i) {
        ratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < ratedDistribution.length ? toLogarithmic(ratedDistribution[i]) : 0,
        });
        unratedDistributionData.push({
            x: 12.5 + i * 25,
            y: i < unratedDistribution.length ? toLogarithmic(unratedDistribution[i]) : 0,
        });
    }

    const xMin = 0;
    const xMax =
        Math.max(ratedDistribution.length, unratedDistribution.length) * 25 <= 3200
            ? 3200
            : Math.ceil((Math.max(ratedDistribution.length, unratedDistribution.length) * 25) / 100) * 100;
    const yMin = 0;
    const rawYMax = range(0, dataLength).reduce(
        (acc, _, i) => Math.max(acc, ratedDistributionData[i].y, unratedDistributionData[i].y),
        0,
    );
    const yStep = 1;
    const yMax = Math.ceil(rawYMax);

    return {
        ratedDistributionData,
        unratedDistributionData,
        xMin,
        xMax,
        yMin,
        yMax,
        yStep,
    };
};
