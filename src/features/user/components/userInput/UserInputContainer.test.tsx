import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { UserInputContainer } from "./UserInputContainer";

const { useUserInputMock, UserInputMock } = vi.hoisted(() => ({ useUserInputMock: vi.fn(), UserInputMock: vi.fn() }));

vi.mock("./useUserInput", () => ({
    useUserInput: useUserInputMock,
}));
vi.mock("./UserInput", () => ({
    UserInput: UserInputMock,
}));

describe("UserInputContainer", () => {
    beforeEach(() => {
        UserInputMock.mockReturnValue(<div data-testid="user-input" />);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders UserInput with props from useUserInput", () => {
        const fakeProps = { foo: "bar" };
        useUserInputMock.mockReturnValue(fakeProps);

        const { getByTestId } = render(<UserInputContainer />);
        const userInput = getByTestId("user-input");

        expect(userInput).toBeInTheDocument();
        expect(UserInputMock).toHaveBeenCalledWith(fakeProps, undefined);
    });

    it("passes className prop to UserInput", () => {
        const fakeProps = { foo: "baz" };
        useUserInputMock.mockReturnValue(fakeProps);

        const className = "test-class";
        render(<UserInputContainer className={className} />);

        expect(UserInputMock).toHaveBeenCalledWith(expect.objectContaining({ className }), undefined);
    });

    it("calls useUserInput hook", () => {
        useUserInputMock.mockReturnValue({});
        render(<UserInputContainer />);
        expect(useUserInputMock).toHaveBeenCalled();
    });
});
