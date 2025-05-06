import { ContestsTableContainer } from "./features/contest/components/contestsTable";
import { PaginationBarContainer } from "./features/pagination/components/paginationBar";

const App = () => {
    return (
        <div>
            <PaginationBarContainer stateKey={"abc"} />
            <ContestsTableContainer contestType={"abc"} />
        </div>
    );
};

export default App;
