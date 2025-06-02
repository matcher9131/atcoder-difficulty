import type { ReactNode } from "react";

type ErrorMessageProps = {
    readonly message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps): ReactNode => {
    return <div className="w-full h-full">{message}</div>;
};
