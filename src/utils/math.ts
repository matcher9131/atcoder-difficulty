const safeSigmoid = (x: number): number => {
    return x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
};

const stddev = 600;

export const irt2pl = (ability: number, discrimination: number, difficulty: number) => {
    return safeSigmoid(discrimination * ((ability - difficulty) / stddev));
};
