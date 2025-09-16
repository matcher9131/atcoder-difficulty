import { base64ToUint8Array } from "../../../utils/buffer";

export const decodeContestDistribution = (encodedZeroIndices: string, encodedNonZeroTerms: string): number[] => {
    const zeroIndices = base64ToUint8Array(encodedZeroIndices);
    const nonZeroTerms = new Uint16Array(base64ToUint8Array(encodedNonZeroTerms).buffer);

    const res: number[] = [];
    let zeroIndex = 0,
        nonZeroIndex = 0;
    while (zeroIndex < zeroIndices.length || nonZeroIndex < nonZeroTerms.length) {
        if (zeroIndex < zeroIndices.length && zeroIndices[zeroIndex] == res.length) {
            res.push(0);
            ++zeroIndex;
        } else if (nonZeroIndex < nonZeroTerms.length) {
            res.push(nonZeroTerms[nonZeroIndex]);
            ++nonZeroIndex;
        }
    }

    return res;
};
