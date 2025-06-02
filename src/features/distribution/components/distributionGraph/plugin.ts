import type { Plugin } from "chart.js";

const colors = ["#e0e0e0", "#e0d0c0", "#c0e080", "#c0f0f0", "#c0c0ff", "#f0f0c0", "#ffe0c0", "#ffc0c0"];

export const chartAreaBackgroundPlugin: Plugin<"bar" | "line"> = {
    id: "chartAreaBackground",
    beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const xScale = chart.scales["x"];
        const xMax = xScale.max;

        ctx.save();
        colors.forEach((color, index) => {
            const left = xScale.getPixelForValue(400 * index);
            const right = xScale.getPixelForValue(index === colors.length - 1 ? xMax : 400 * (index + 1));
            ctx.fillStyle = color;
            ctx.fillRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top);
        });
        ctx.restore();
    },
};
