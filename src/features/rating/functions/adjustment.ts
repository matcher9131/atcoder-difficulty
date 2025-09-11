export const adjustmentByNumContest = (n: number): number => {
    if (n === Infinity) return 0;
    return (1200 * (Math.sqrt(1 - 0.81 ** n) / (1 - 0.9 ** n) - 1)) / (Math.sqrt(19) - 1);
};

export const inverseAdjustmentOfLowRating = (x: number): number => {
    if (x === 0) {
        x = 1e-6;
    }
    return x >= 400 ? x : 400 * (1 - Math.log(400 / x));
};

export const getRawRating = (rating: number, numContest: number): number => {
    return inverseAdjustmentOfLowRating(rating) - adjustmentByNumContest(numContest);
};
