import { useAtom } from "jotai";
import { selectedLanguageEffect } from "./features/i18n/models/selectedLanguage";
import { Suspense } from "react";
import { LoadingIndicator } from "./features/suspense/components/loadingIndicator";
import { MainPage } from "./features/page/components/mainPage/MainPage";
import { ErrorBoundary } from "react-error-boundary";
import { MainPageError } from "./features/page/components/mainPageError/MainPageError";

const App = () => {
    useAtom(selectedLanguageEffect);

    return (
        <ErrorBoundary FallbackComponent={MainPageError}>
            <Suspense fallback={<LoadingIndicator />}>
                <MainPage />
            </Suspense>
        </ErrorBoundary>
    );
};

export default App;
