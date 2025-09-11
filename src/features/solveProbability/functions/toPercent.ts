export const toPercent = (x: number): string => {
    return x < 0 ? "NaN" : x >= 0.9995 ? ">99.9%" : x < 0.0005 ? "<0.1%" : `${(x * 100).toFixed(1)}%`;
};
