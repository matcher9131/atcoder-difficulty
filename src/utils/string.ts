export const capitalize = (s: string): string => {
    if (s === "") return s;
    return s.substring(0, 1).toUpperCase() + s.substring(1);
};
