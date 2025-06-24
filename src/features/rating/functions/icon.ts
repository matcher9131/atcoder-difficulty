export const getRatingIconHref = (rating: number): string => {
    const level = rating >= 3200 ? 4 : (Math.floor(rating / 100) % 4) + 1;
    return (
        (import.meta.env.PROD ? "/atcoder-difficulty" : "") +
        `/resources/up_arrow_${level.toString()}.svg#up_arrow_${level.toString()}`
    );
};
