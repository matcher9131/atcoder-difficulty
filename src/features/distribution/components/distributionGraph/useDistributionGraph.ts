import { useAtomValue } from "jotai";
import { distributionAtom } from "../../models/distributions";
import type { DistributionGraphProps } from "./DistributionGraph";
import { selectedProblemAtom } from "../../models/selectedProblem";

export const useDistributionGraph = (): DistributionGraphProps => {
    const problemId = useAtomValue(selectedProblemAtom);
    const distribution = useAtomValue(distributionAtom(problemId));
    const labels = new Array(distribution.length).fill(0).map((_, i) => i * 25);
    const distributionData = Array.from(distribution, (frequency, i) => [i * 25, frequency] as [number, number]);
    return {
        data: {
            labels,
            datasets: [
                {
                    label: "Actual Solve Probability",
                    data: distributionData,
                    type: "bar",
                },
            ],
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 10,
                    },
                },
            },
        },
    };
};
