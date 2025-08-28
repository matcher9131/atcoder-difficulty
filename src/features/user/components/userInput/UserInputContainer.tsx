import { useRef, type ReactNode } from "react";
import { UserInput } from "./UserInput";
import { useUserInput } from "./useUserInput";

export const UserInputContainer = ({ className }: { readonly className?: string }): ReactNode => {
    const inputRef = useRef<HTMLInputElement>(null);
    const props = useUserInput(inputRef);
    return <UserInput {...props} className={className} />;
};
