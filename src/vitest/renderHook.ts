import { renderHook as originalRenderHook } from "@testing-library/react";
import { Provider } from "jotai";

export const renderHook = <T, Props>(
    render: (initialProps: Props) => T,
): ReturnType<typeof originalRenderHook<T, Props>> => {
    return originalRenderHook(render, { wrapper: Provider });
};
