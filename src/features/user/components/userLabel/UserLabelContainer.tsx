import type { ReactNode } from "react";
import { useUserLabel } from "./useUserLabel";
import { UserLabel } from "./UserLabel";

export const UserLabelContainer = (): ReactNode => {
    const props = useUserLabel();
    return <UserLabel {...props} />;
};
