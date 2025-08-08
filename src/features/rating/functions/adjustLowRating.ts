export const adjustLowRating = (rating: number): number => {
    return rating < 400 ? 400 / Math.exp((400 - rating) / 400) : rating;
};
