const timeOfDay = 24 * 60 * 60 * 1000;

export const parseDateOrNull = (s: string): Date | null => {
    const n = Date.parse(s);
    if (Number.isNaN(n)) return null;
    return new Date(n);
};

export const setUTCTimeOfDay = (dateTime: Date, hours: number, minutes = 0, seconds = 0): Date => {
    const time = dateTime.getTime();
    const startOfDay = Math.floor(time / timeOfDay) * timeOfDay;
    return new Date(startOfDay + hours * 3600_000 + minutes * 60_000 + seconds * 1000);
};

export const addDays = (dateTime: Date, daysToAdd: number): Date => {
    return new Date(dateTime.getTime() + timeOfDay * daysToAdd);
};
