export const classToDisplay = (median: number): string => {
    return `${(median - 12.5).toString()} - ${(median + 12.5).toString()}`;
};
