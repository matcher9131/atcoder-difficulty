import { ProblemCell } from "./features/problem/components/ProblemCell";

const App = () => {
    return (
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
    );
};

export default App;
