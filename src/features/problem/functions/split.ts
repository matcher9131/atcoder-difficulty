export const splitProblemId = (problemId: string): [string, string] => {
    const i = problemId.indexOf("/");
    return [problemId.substring(0, i), problemId.substring(i + 1)];
};
