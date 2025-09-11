import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { UserInput, type UserInputProps } from "./UserInput";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) =>
            ({
                "userInput.inputLabel": "User Name",
                "userInput.buttonLabel": "Submit",
            })[key] ?? key,
    }),
}));

describe("UserInput", () => {
    const defaultProps: UserInputProps = {
        inputRef: createRef<HTMLInputElement>(),
        buttonIsDisabled: false,
        handleClick: vi.fn(),
        validationState: "success",
        validationMessage: "",
        className: "",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders input label and button label", () => {
        render(<UserInput {...defaultProps} />);
        expect(screen.getByText("User Name")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveTextContent("Submit");
    });

    it("renders validation message", () => {
        render(<UserInput {...defaultProps} validationMessage="Invalid name" />);
        expect(screen.getByText("Invalid name")).toBeInTheDocument();
    });

    it("applies input-success class when validationState is 'success'", () => {
        render(<UserInput {...defaultProps} validationState="success" />);
        const label = screen.getByText("User Name").closest("label");
        expect(label).toHaveClass("input-success");
    });

    it("applies input-error class when validationState is 'error'", () => {
        render(<UserInput {...defaultProps} validationState="error" />);
        const label = screen.getByText("User Name").closest("label");
        expect(label).toHaveClass("input-error");
    });

    it("does not apply input-success or input-error class when validationState is 'none'", () => {
        render(<UserInput {...defaultProps} validationState="none" />);
        const label = screen.getByText("User Name").closest("label");
        expect(label).not.toHaveClass("input-success");
        expect(label).not.toHaveClass("input-error");
    });

    it("disables button and shows spinner when buttonIsDisabled is true", () => {
        render(<UserInput {...defaultProps} buttonIsDisabled={true} />);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("enables button and shows label when buttonIsDisabled is false", () => {
        render(<UserInput {...defaultProps} buttonIsDisabled={false} />);
        const button = screen.getByRole("button");
        expect(button).not.toBeDisabled();
        expect(button).toHaveTextContent("Submit");
    });

    it("calls handleClick when button is clicked", () => {
        const handleClick = vi.fn();
        render(<UserInput {...defaultProps} handleClick={handleClick} />);
        fireEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalled();
    });

    it("assigns inputRef to the input element", () => {
        const inputRef = createRef<HTMLInputElement>();
        render(<UserInput {...defaultProps} inputRef={inputRef} />);
        expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    });

    it("applies custom className to root div", () => {
        render(<UserInput {...defaultProps} className="custom-class" />);
        const rootDiv = screen.getByText("User Name").closest("div");
        expect(rootDiv).toHaveClass("custom-class");
    });

    it("input has correct pattern and class", () => {
        render(<UserInput {...defaultProps} />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("pattern", "^[0-9A-Za-z_]+$");
        expect(input).toHaveClass("grow");
        expect(input).toHaveClass("text-right");
    });
});
