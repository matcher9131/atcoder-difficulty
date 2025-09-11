import { capitalize } from "../../../utils/string";

export const getProblemIndex = (problemId: string): string => {
    return capitalize(problemId.substring(problemId.lastIndexOf("_") + 1));
};
