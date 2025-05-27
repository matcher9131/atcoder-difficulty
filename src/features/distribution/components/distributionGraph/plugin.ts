import type { ChartArea, Plugin } from "chart.js";

const colors = ["#808080", "#804000", "#008000", "#00c0c0", "#2060ff", "#c0c000", "#ff8000", "#ff0000"];

const getRect = (
    ratingMin: number,
    xMin: number,
    xMax: number,
    chartArea: ChartArea,
): { readonly left: number; readonly width: number } => {
    const left = ((xMax - ratingMin) * chartArea.left + (ratingMin - xMin) * chartArea.right) / (xMax - xMin);
    const width = ((chartArea.right - chartArea.left) * 400) / (xMax - xMin);
    return { left, width };
};

export const chartAreaBackgroundPlugin: Plugin<"bar" | "line"> = {
    id: "chartAreaBackground",
    beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const labels = chart.data.labels;
        if (labels == null) return;
        const xMin = labels[0] as number;
        const xMax = labels[labels.length - 1] as number;

        ctx.save();
        colors.forEach((color, index) => {
            const { left, width } = getRect(400 * index, xMin, xMax, chartArea);
            ctx.fillStyle = color;
            ctx.fillRect(
                left,
                chartArea.top,
                index === colors.length - 1 ? chartArea.right - left : width,
                chartArea.bottom - chartArea.top,
            );
        });
        ctx.restore();
    },
};
