import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { Language } from "../../types/language";

export type LanguageSelectorProps = {
    readonly selectedLanguage: Language;
    readonly onClickEnglish: () => void;
    readonly onClickJapanese: () => void;
};

export const LanguageSelector = ({
    selectedLanguage,
    onClickEnglish,
    onClickJapanese,
}: LanguageSelectorProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="flex">
            <button
                popoverTarget="language_popover"
                style={{ anchorName: "--language-popover-anchor" } as CSSProperties}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={t("languageSelector.label")}
                    viewBox="0 -960 960 960"
                    className="h-10 w-10 fill-current cursor-pointer hover:brightness-75 transition-all"
                >
                    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z" />
                </svg>
            </button>

            <ul
                id="language_popover"
                popover="auto"
                className="dropdown dropdown-end menu bg-base-300 rounded-box z-1 border border-white/5 shadow-xl outline-1 outline-black/5"
                style={{ positionAnchor: "--language-popover-anchor" } as CSSProperties}
            >
                <li>
                    <button onClick={onClickEnglish} className={clsx(selectedLanguage === "en" && "menu-active")}>
                        English
                    </button>
                </li>
                <li>
                    <button onClick={onClickJapanese} className={clsx(selectedLanguage === "ja" && "menu-active")}>
                        日本語
                    </button>
                </li>
            </ul>
        </div>
    );
};
