import type { ReactNode } from "react";
import { ContestStatsDialog } from "../../../contestStats/components/contestStatsDialog";
import { DistributionGraphDialog } from "../../../distribution/components/distributionGraphDialog/DistributionGraphDialog";
import { PageHeader } from "../../../header/components/pageHeader/PageHeader";
import { ProblemsTabContainer } from "../../../tabs/components/problemsTab";
import { UserLabelContainer } from "../../../user/components/userLabel";
import { UserInputContainer } from "../../../user/components/userInput";

export const MainPage = (): ReactNode => {
    return (
        <div className="w-full px-4 flex flex-col items-center">
            <DistributionGraphDialog />
            <ContestStatsDialog />
            <PageHeader />
            <UserInputContainer />
            <UserLabelContainer />
            <ProblemsTabContainer />
        </div>
    );
};
