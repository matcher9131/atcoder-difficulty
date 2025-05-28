import type { Plugin } from "chart.js";

const colors = ["#e0e0e0", "#e0d0c0", "#c0e080", "#c0f0f0", "#c0c0ff", "#f0f0c0", "#ffe0c0", "#ffc0c0"];

export const chartAreaBackgroundPlugin: Plugin<"bar" | "line"> = {
    id: "chartAreaBackground",
    beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const labels = chart.data.labels;
        if (labels == null) return;
        const xScale = chart.scales["x"];
        const xMax = labels[labels.length - 1] as number;

        ctx.save();
        colors.forEach((color, index) => {
            // Somehow true value (rating) doesn't work... index wokrs well instead.
            const left = xScale.getPixelForValue((400 * index) / 12.5);
            const right = xScale.getPixelForValue(
                index === colors.length - 1 ? xMax / 12.5 : (400 * (index + 1)) / 12.5,
            );
            ctx.fillStyle = color;
            ctx.fillRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top);
        });
        ctx.restore();
    },
};
