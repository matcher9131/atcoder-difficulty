import type { ReactNode } from "react";
import { UserInput } from "./UserInput";
import { useUserInput } from "./useUserInput";

export const UserInputContainer = (): ReactNode => {
    const props = useUserInput();
    return <UserInput {...props} />;
};
