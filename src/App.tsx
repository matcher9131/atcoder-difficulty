import { ContestHeaderCell } from "./features/contest/components/ContestHeaderCell";
import { ProblemCell } from "./features/problem/components/problemCell/ProblemCell";

const App = () => {
    return (
        <>
            <div className="border w-60">
                <ProblemCell
                    fillColor="fill-rating-1200"
                    iconHref="/resources/up_arrow_3.svg#up_arrow_3"
                    difficulty={1234}
                    displayName="Supercalifragilisticexpialidocious"
                    textColor="text-rating-1200"
                    linkHref="https://example.com/"
                />
            </div>
            <div className="border w-60">
                <ContestHeaderCell
                    textColor="text-rating-1600"
                    displayName="ABC400"
                    linkHref="https://atcoder.jp/contests/abc400"
                />
            </div>
        </>
    );
};

export default App;
