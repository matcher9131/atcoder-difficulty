import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../../../../vitest/render";
import { ContestHeaderCellContainer } from "./ContestHeaderCellContainer";
import { useContestHeaderCell } from "./useContestHeaderCell";
import { ContestHeaderCell } from "./ContestHeaderCell";

// src/features/contest/components/contestHeaderCell/ContestHeaderCellContainer.test.tsx

// Mock ContestHeaderCell and useContestHeaderCell
const mockProps = {
    textColor: "text-blue-500",
    displayName: "Mock Contest",
    linkHref: "https://mock.com",
    onStatsButtonClick: vi.fn(),
    statsIconHref: "#icon-mock",
};

vi.mock("./useContestHeaderCell", () => ({
    useContestHeaderCell: vi.fn(),
}));

vi.mock("./ContestHeaderCell", () => ({
    ContestHeaderCell: vi.fn(() => <div data-testid="contest-header-cell" />),
}));

describe("ContestHeaderCellContainer", () => {
    const contestId = "abc123";

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestHeaderCell as any).mockClear();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (ContestHeaderCell as any).mockClear();
    });

    it("calls useContestHeaderCell with contestId", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestHeaderCell as any).mockReturnValue(mockProps);
        render(<ContestHeaderCellContainer contestId={contestId} />);
        expect(useContestHeaderCell).toHaveBeenCalledWith(contestId);
    });

    it("renders ContestHeaderCell with props from hook", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestHeaderCell as any).mockReturnValue(mockProps);
        render(<ContestHeaderCellContainer contestId={contestId} />);
        expect(ContestHeaderCell).toHaveBeenCalledWith(mockProps, undefined);
    });

    it("matches snapshot", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (useContestHeaderCell as any).mockReturnValue(mockProps);
        const { container } = render(<ContestHeaderCellContainer contestId={contestId} />);
        expect(container).toMatchSnapshot();
    });
});
