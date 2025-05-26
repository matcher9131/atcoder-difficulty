import { useAtom } from "jotai";
import { PageHeader } from "./features/header/components/pageHeader/PageHeader";
import { ProblemsTabContainer } from "./features/tabs/components/problemsTab/";
import { selectedLanguageEffect } from "./features/i18n/models/selectedLanguage";
import { DistributionGraphDialog } from "./features/distribution/components/distributionGraphDialog/DistributionGraphDialog";

const App = () => {
    useAtom(selectedLanguageEffect);

    return (
        <div className="w-full px-4 flex flex-col items-center">
            <DistributionGraphDialog />
            <PageHeader />
            <ProblemsTabContainer />
        </div>
    );
};

export default App;
