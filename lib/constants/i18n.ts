import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEn from "../../public/locales/en/translation.json";
import translationEs from "../../public/locales/es/translation.json";
import translationFi from "../../public/locales/fi/translation.json";
import translationFr from "../../public/locales/fr/translation.json";
import translationZhcn from "../../public/locales/zh-cn/translation.json";

if (!i18n.isInitialized) {
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                en: translationEn,
                es: translationEs,
                fi: translationFi,
                fr: translationFr,
                "zh-cn": translationZhcn
            },
            fallbackLng: "en",
            debug: false,
            interpolation: {
                escapeValue: false
            },
            ns: ["common", "account", "errors", "exportSetlist", "landingPage", "setlistSearch"],
            detection: {
                order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
                caches: ["cookie"]
            }
        });
}

export default i18n;
