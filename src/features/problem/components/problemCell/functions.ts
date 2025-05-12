import { capitalize } from "../../../../utils/string";

export const getFillColor = (rating: number): string => {
    switch (Math.floor(rating / 400)) {
        case 0:
            return "fill-rating-0";
        case 1:
            return "fill-rating-400";
        case 2:
            return "fill-rating-800";
        case 3:
            return "fill-rating-1200";
        case 4:
            return "fill-rating-1600";
        case 5:
            return "fill-rating-2000";
        case 6:
            return "fill-rating-2400";
        default:
            return "fill-rating-2800";
    }
};

export const getTextColor = (rating: number): string => {
    switch (Math.floor(rating / 400)) {
        case 0:
            return "text-rating-0";
        case 1:
            return "text-rating-400";
        case 2:
            return "text-rating-800";
        case 3:
            return "text-rating-1200";
        case 4:
            return "text-rating-1600";
        case 5:
            return "text-rating-2000";
        case 6:
            return "text-rating-2400";
        default:
            return "text-rating-2800";
    }
};

export const getProblemIndex = (problemId: string): string => {
    return capitalize(problemId.substring(problemId.lastIndexOf("_") + 1));
};
