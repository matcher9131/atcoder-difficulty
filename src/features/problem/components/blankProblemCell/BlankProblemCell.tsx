import type { ReactNode } from "react";
import { cellClassNames } from "../../../../common/cellClassNames";

export const BlankProblemCell = (): ReactNode => {
    return <td className={cellClassNames}></td>;
};
