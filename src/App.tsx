import { PageHeader } from "./features/header/components/pageHeader/PageHeader";
import { ProblemsTabContainer } from "./features/tabs/components/problemsTab/";

const App = () => {
    return (
        <div>
            <PageHeader />
            <ProblemsTabContainer />
        </div>
    );
};

export default App;
