const table = "ABCDEFGHIJ";

const isSet = (bit: number, i: number): boolean => {
    return (bit & (1 << i)) > 0;
};

export const scoreToPatterns = (targetScore: number, scores: readonly number[]): string[] => {
    const results: string[] = [];
    for (let bit = 0; bit < 1 << scores.length; ++bit) {
        if (scores.reduce((acc, score, i) => acc + (isSet(bit, i) ? score : 0), 0) == targetScore) {
            results.push(scores.reduce((acc, _, i) => acc + (isSet(bit, i) ? table[i] : ""), ""));
        }
    }
    return results;
};
