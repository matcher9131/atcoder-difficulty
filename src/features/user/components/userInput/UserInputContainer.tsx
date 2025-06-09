import type { ReactNode } from "react";
import { UserInput } from "./UserInput";
import { useUserInput } from "./useUserInput";

export const UserInputContainer = ({ className }: { readonly className?: string }): ReactNode => {
    const props = useUserInput();
    return <UserInput {...props} className={className} />;
};
