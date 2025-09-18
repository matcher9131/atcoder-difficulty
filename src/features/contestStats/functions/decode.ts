export const decodeContestDistribution = (encodedZeroIndices: string, encodedNonZeroBytes: string): number[] => {
    const zeroIndicesBitArray = Uint8Array.from(atob(encodedZeroIndices), (ch) => ch.charCodeAt(0));
    const nonZeroBytes = Uint8Array.from(atob(encodedNonZeroBytes), (ch) => ch.charCodeAt(0));
    const res = new Uint8Array(encodedZeroIndices.length * 6);

    let nonZeroIndex = 0;
    for (let i = 0; i < res.length; ++i) {
        if (zeroIndicesBitArray[i >> 3] & (1 << (7 - (i % 8)))) {
            res[i] = 0;
        } else {
            res[i] = nonZeroBytes[nonZeroIndex];
            ++nonZeroIndex;
        }
    }

    return Array.from(new Uint16Array(res.buffer));
};
