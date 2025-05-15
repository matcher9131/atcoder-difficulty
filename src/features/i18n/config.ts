import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import dict_en from "./dict/en.json";
import dict_ja from "./dict/ja.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: dict_en },
        ja: { translation: dict_ja },
    },
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
