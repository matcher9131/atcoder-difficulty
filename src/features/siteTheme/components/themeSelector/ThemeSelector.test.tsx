import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { ThemeSelector, type ThemeSelectorProps } from "./ThemeSelector";
import { render } from "../../../../vitest/render";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const defaultProps: ThemeSelectorProps = {
    isDarkMode: false,
    onChange: vi.fn(),
};

describe("ThemeSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders checkbox input with correct attributes", () => {
        render(<ThemeSelector {...defaultProps} />);
        const input = screen.getByRole("checkbox");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "checkbox");
        expect(input).toHaveAttribute("value", "dark");
        expect(input).toHaveClass("theme-controller");
        expect(input).not.toBeChecked();
    });

    it("checkbox reflects isDarkMode prop", () => {
        render(<ThemeSelector {...defaultProps} isDarkMode={true} />);
        const input = screen.getByRole("checkbox");
        expect(input).toBeChecked();
    });

    it("calls onChange when checkbox is clicked", () => {
        render(<ThemeSelector {...defaultProps} />);
        const input = screen.getByRole("checkbox");
        fireEvent.click(input);
        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    });

    it("renders swap label with correct classes", () => {
        render(<ThemeSelector {...defaultProps} />);
        const label = screen.getByLabelText("themeSelector.uncheckedLabel").closest("label");
        expect(label).toHaveClass("swap", "swap-rotate", "hover:invert-30", "transition-all");
    });

    it("renders unchecked SVG with correct attributes", () => {
        render(<ThemeSelector {...defaultProps} />);
        const svg = screen.getByLabelText("themeSelector.uncheckedLabel");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("role", "img");
        expect(svg).toHaveClass("swap-off", "h-10", "w-10", "fill-current", "transition-all");
        expect(svg.querySelector("path")).not.toBeNull();
    });

    it("renders checked SVG with correct attributes", () => {
        render(<ThemeSelector {...defaultProps} />);
        const svg = screen.getByLabelText("themeSelector.checkedLabel");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("role", "img");
        expect(svg).toHaveClass("swap-on", "h-10", "w-10", "fill-current", "transition-all");
        expect(svg.querySelector("path")).not.toBeNull();
    });

    it("uses translation keys for aria-labels", () => {
        render(<ThemeSelector {...defaultProps} />);
        expect(screen.getByLabelText("themeSelector.uncheckedLabel")).toBeInTheDocument();
        expect(screen.getByLabelText("themeSelector.checkedLabel")).toBeInTheDocument();
    });

    it("matches snapshot", () => {
        const { container } = render(<ThemeSelector {...defaultProps} />);
        expect(container).toMatchSnapshot();
    });
});
