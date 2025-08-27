import { describe, it, expect, vi, beforeEach } from "vitest";
import { useThemeSelector } from "./useThemeSelector";
import type { ChangeEvent } from "react";

const { useAtomMock, setIsDarkModeMock } = vi.hoisted(() => ({
    useAtomMock: vi.fn(),
    setIsDarkModeMock: vi.fn(),
}));

vi.mock("jotai", () => ({
    useAtom: useAtomMock,
}));
vi.mock("../../models/isDarkMode", () => ({
    isDarkModeAtom: vi.fn(),
}));

describe("useThemeSelector", () => {
    beforeEach(() => {
        setIsDarkModeMock.mockClear();
    });

    it("returns isDarkMode from atom", () => {
        useAtomMock.mockReturnValue([true, setIsDarkModeMock]);
        const result = useThemeSelector();
        expect(result.isDarkMode).toBe(true);
    });

    it("onChange calls setIsDarkMode with checked=true", () => {
        useAtomMock.mockReturnValue([false, setIsDarkModeMock]);
        const result = useThemeSelector();
        const event = { target: { checked: true } } as ChangeEvent<HTMLInputElement>;
        result.onChange(event);
        expect(setIsDarkModeMock).toHaveBeenCalledWith(true);
    });

    it("onChange calls setIsDarkMode with checked=false", () => {
        useAtomMock.mockReturnValue([true, setIsDarkModeMock]);
        const result = useThemeSelector();
        const event = { target: { checked: false } } as ChangeEvent<HTMLInputElement>;
        result.onChange(event);
        expect(setIsDarkModeMock).toHaveBeenCalledWith(false);
    });
});
