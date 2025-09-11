import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { useUserInput } from "./useUserInput";
import { UserNotFoundError } from "../../types/fetchUserError";
import { renderHook } from "../../../../vitest/renderHook";

const {
    fetchUserMock,
    useAtomMock,
    setUserNameMock,
    setValidationStateMock,
    setValidationMessageMock,
    setRatingMock,
    setNumContestsMock,
    setSolveProbabilityPaginationValueMock,
    useAtomMockDict,
} = vi.hoisted(() => {
    const fetchUserMock = vi.fn().mockResolvedValue({ rating: 1200, numContests: 10 });
    const setUserNameMock = vi.fn();
    const setValidationStateMock = vi.fn();
    const setValidationMessageMock = vi.fn();
    const setRatingMock = vi.fn();
    const setNumContestsMock = vi.fn();
    const setSolveProbabilityPaginationValueMock = vi.fn();

    const useAtomMockDict: Record<string, unknown> = {
        userNameAtom: ["", setUserNameMock],
        userNameValidationStateAtom: ["none", setValidationStateMock],
        userNameValidationMessageAtom: ["", setValidationMessageMock],
        ratingAtom: [null, setRatingMock],
        numContestsAtom: [null, setNumContestsMock],
        paginationValueAtom: [null, setSolveProbabilityPaginationValueMock],
    };

    return {
        fetchUserMock,
        setUserNameMock,
        setValidationStateMock,
        setValidationMessageMock,
        setRatingMock,
        setNumContestsMock,
        setSolveProbabilityPaginationValueMock,
        useAtomMock: vi.fn().mockImplementation((atom: string) => useAtomMockDict[atom]),
        useAtomMockDict,
    };
});

vi.mock("../../../pagination/model/paginations", () => ({
    paginationValueAtom: () => "paginationValueAtom",
}));
vi.mock("../../models/username", () => ({
    userNameAtom: "userNameAtom",
    userNameValidationStateAtom: "userNameValidationStateAtom",
    userNameValidationMessageAtom: "userNameValidationMessageAtom",
}));
vi.mock("../../../rating/models/atom", () => ({
    ratingAtom: "ratingAtom",
    numContestsAtom: "numContestsAtom",
}));
vi.mock(import("jotai"), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useAtom: useAtomMock,
    };
});
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: vi.fn((key: string) => key) }),
}));
vi.mock("../../functions/fetchUser", () => ({
    fetchUser: fetchUserMock,
}));

describe("useUserInput", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns correct initial values", () => {
        const input = document.createElement("input");
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        expect(result.current).toHaveProperty("inputRef");
        expect(result.current).toHaveProperty("buttonIsDisabled");
        expect(result.current).toHaveProperty("handleClick");
        expect(result.current).toHaveProperty("validationState");
        expect(result.current).toHaveProperty("validationMessage");
    });

    it("does nothing if input value equals userName", () => {
        const useAtomMockDict2: Record<string, unknown> = {
            ...useAtomMockDict,
            userNameAtom: ["oldUser", setUserNameMock],
        };
        useAtomMock.mockImplementation((atom: string) => useAtomMockDict2[atom]);
        const input = document.createElement("input");
        input.value = "oldUser";
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        act(() => {
            result.current.handleClick();
        });
        expect(setSolveProbabilityPaginationValueMock).not.toHaveBeenCalled();
    });

    it("resets state if input value is empty", () => {
        const useAtomMockDict2: Record<string, unknown> = {
            ...useAtomMockDict,
            userNameAtom: ["oldUser", setUserNameMock],
        };
        useAtomMock.mockImplementation((atom: string) => useAtomMockDict2[atom]);
        const input = document.createElement("input");
        input.value = "";
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        act(() => {
            result.current.handleClick();
        });
        expect(setSolveProbabilityPaginationValueMock).toHaveBeenCalledWith(0);
        expect(setRatingMock).toHaveBeenCalledWith(null);
        expect(setNumContestsMock).toHaveBeenCalledWith(null);
        expect(setValidationStateMock).toHaveBeenCalledWith("none");
        expect(setValidationMessageMock).toHaveBeenCalledWith("");
    });

    it("handles fetchUser success", async () => {
        const useAtomMockDict2: Record<string, unknown> = {
            ...useAtomMockDict,
            userNameAtom: ["oldUser", setUserNameMock],
        };
        useAtomMock.mockImplementation((atom: string) => useAtomMockDict2[atom]);
        const input = document.createElement("input");
        input.value = "newUser";
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        act(() => {
            result.current.handleClick();
        });
        expect(setSolveProbabilityPaginationValueMock).toHaveBeenCalledWith(0);
        expect(setUserNameMock).toHaveBeenCalledWith("newUser");
        expect(fetchUserMock).toHaveBeenCalledWith("newUser");
        await waitFor(() => {
            expect(setRatingMock).toHaveBeenCalledWith(1200);
            expect(setNumContestsMock).toHaveBeenCalledWith(10);
            expect(setValidationStateMock).toHaveBeenCalledWith("success");
            expect(setValidationMessageMock).toHaveBeenCalledWith("");
        });
    });

    it("handles fetchUser UserNotFoundError", async () => {
        fetchUserMock.mockRejectedValue(new UserNotFoundError());
        const useAtomMockDict2: Record<string, unknown> = {
            ...useAtomMockDict,
            userNameAtom: ["oldUser", setUserNameMock],
        };
        useAtomMock.mockImplementation((atom: string) => useAtomMockDict2[atom]);
        const input = document.createElement("input");
        input.value = "newUser";
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        act(() => {
            result.current.handleClick();
        });
        await waitFor(() => {
            expect(setRatingMock).toHaveBeenCalledWith(null);
            expect(setNumContestsMock).toHaveBeenCalledWith(null);
            expect(setValidationStateMock).toHaveBeenCalledWith("error");
            expect(setValidationMessageMock).toHaveBeenCalledWith("userInput.userNotFoundMessage");
        });
    });

    it("handles fetchUser generic error", async () => {
        fetchUserMock.mockRejectedValue(new Error("Some error"));
        const useAtomMockDict2: Record<string, unknown> = {
            ...useAtomMockDict,
            userNameAtom: ["oldUser", setUserNameMock],
        };
        useAtomMock.mockImplementation((atom: string) => useAtomMockDict2[atom]);
        const input = document.createElement("input");
        input.value = "newUser";
        const inputRef = { current: input };
        const { result } = renderHook(() => useUserInput(inputRef));
        act(() => {
            result.current.handleClick();
        });
        await waitFor(() => {
            expect(setRatingMock).toHaveBeenCalledWith(null);
            expect(setNumContestsMock).toHaveBeenCalledWith(null);
            expect(setValidationStateMock).toHaveBeenCalledWith("error");
            expect(setValidationMessageMock).toHaveBeenCalledWith("userInput.fetchUserErrorMessage");
        });
    });
});
