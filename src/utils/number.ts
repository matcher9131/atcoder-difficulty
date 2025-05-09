export const parseIntOrNull = (s: string): number | null => {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? null : n;
};
