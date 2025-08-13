export const toPercent = (x: number): string => {
    return x > 1 ? "" : x < 0 ? "NaN" : x >= 0.995 ? ">99%" : x < 0.005 ? "<1%" : `${(x * 100).toFixed(0)}%`;
};
