export const parseDateOrNull = (s: string): Date | null => {
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : new Date(t);
};
