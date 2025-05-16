import { useAtom } from "jotai";
import { PageHeader } from "./features/header/components/pageHeader/PageHeader";
import { ProblemsTabContainer } from "./features/tabs/components/problemsTab/";
import { selectedLanguageEffect } from "./features/i18n/models/selectedLanguage";

const App = () => {
    useAtom(selectedLanguageEffect);
    return (
        <div>
            <PageHeader />
            <ProblemsTabContainer />
        </div>
    );
};

export default App;
