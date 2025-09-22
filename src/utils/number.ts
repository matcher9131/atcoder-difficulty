export const parseIntOrNull = (s: string): number | null => {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? null : n;
};

export const roundToOneDigit = (x: number): number => {
    if (x <= 0) throw new Error("'x' must be a positive number.");
    const scale = 10 ** Math.floor(Math.log10(x));
    return scale * Math.round(x / scale);
};
