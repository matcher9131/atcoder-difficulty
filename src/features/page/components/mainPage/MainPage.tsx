import type { ReactNode } from "react";
import { DistributionGraphDialog } from "../../../distribution/components/distributionGraphDialog/DistributionGraphDialog";
import { PageHeader } from "../../../header/components/pageHeader/PageHeader";
import { ProblemsTabContainer } from "../../../tabs/components/problemsTab";
import { UserLabelContainer } from "../../../user/components/userLabel";

export const MainPage = (): ReactNode => {
    return (
        <div className="w-full px-4 flex flex-col items-center">
            <DistributionGraphDialog />
            <PageHeader />
            <UserLabelContainer />
            <ProblemsTabContainer />
        </div>
    );
};
