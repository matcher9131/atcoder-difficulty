export const getTextColor = (maxRating: number | "inf"): string => {
    if (maxRating == "inf") {
        return "text-rating-2800";
    } else if (maxRating >= 2800) {
        return "bg-gradient-to-d from-rating-2800 to-rating-2400 text-transparent bg-clip-text";
    } else {
        switch (Math.floor(maxRating / 400)) {
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
    }
};
