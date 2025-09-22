import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    Tooltip,
    Title,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    BarController,
    LineController,
    Title,
    Legend,
    Tooltip,
);
