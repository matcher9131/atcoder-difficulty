export const decodeContestDistribution = (encodedZeroIndices: string, encodedNonZeroBytes: string): number[] => {
    const zeroIndicesBitArray = Uint8Array.from(atob(encodedZeroIndices), (ch) => ch.charCodeAt(0));
    const nonZeroBytes = Uint8Array.from(atob(encodedNonZeroBytes), (ch) => ch.charCodeAt(0));
    const bytes = new Uint8Array(encodedZeroIndices.length * 6);

    let nonZeroIndex = 0;
    for (let i = 0; i < bytes.length; ++i) {
        if (zeroIndicesBitArray[i >> 3] & (1 << (7 - (i % 8)))) {
            bytes[i] = 0;
        } else {
            bytes[i] = nonZeroBytes[nonZeroIndex];
            ++nonZeroIndex;
        }
    }

    const result = Array.from(new Uint16Array(bytes.buffer));
    return result.slice(
        0,
        result.findLastIndex((val) => val > 0),
    );
};
