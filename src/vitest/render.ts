import { render as originalRender, type RenderOptions } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";

export const render = (
    element: ReactNode,
    options?: Omit<RenderOptions, "queries">,
): ReturnType<typeof originalRender> & { readonly user: UserEvent } => {
    return {
        user: userEvent.setup(),
        ...originalRender(element, options),
    };
};
