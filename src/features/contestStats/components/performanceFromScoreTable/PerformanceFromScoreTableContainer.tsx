import type { ReactNode } from "react";
import { usePerformanceFromScoreTable } from "./usePerformanceFromScoreTable";
import { PerformanceFromScoreTable } from "./PerformanceFromScoreTable";

export const PerformanceFromScoreTableContainer = (): ReactNode => {
    const props = usePerformanceFromScoreTable();
    return <PerformanceFromScoreTable {...props} />;
};
