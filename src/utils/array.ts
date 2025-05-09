export const lowerBound = <T>(arr: readonly T[], selector: (x: T) => number, value: number): number => {
    let left = 0;
    let right = arr.length;
    while (right - left > 0) {
        const mid = Math.floor((left + right) / 2);
        if (selector(arr[mid]) < value) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
};

export const range = (start: number, count: number): number[] => {
    return new Array(count).fill(0).map((_, i) => start + i);
};

export const thinnedRange = (minIncluded: number, base: number, maxExcluded: number): number[] => {
    const result = [base];
    for (let i = 0; ; ++i) {
        const x = base - (1 << i);
        if (x < minIncluded) {
            if (!result.includes(minIncluded)) {
                result.unshift(minIncluded);
            }
            break;
        }
        result.unshift(x);
    }
    for (let i = 0; ; ++i) {
        const x = base + (1 << i);
        if (x >= maxExcluded) {
            if (!result.includes(maxExcluded - 1)) {
                result.push(maxExcluded - 1);
            }
            break;
        }
        result.push(x);
    }
    return result;
};
