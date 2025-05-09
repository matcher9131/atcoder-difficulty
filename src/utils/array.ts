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
