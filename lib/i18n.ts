import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "../public/locales/en/common.json";
import landingPageEn from "../public/locales/en/landing-page.json";
import setlistSearchEn from "../public/locales/en/setlist-search.json";
import errorsEn from "../public/locales/en/errors.json";

if (!i18n.isInitialized) {
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                en: {
                    common: commonEn,
                    "landing-page": landingPageEn,
                    "setlist-search": setlistSearchEn,
                    "errors": errorsEn
                }
            },
            fallbackLng: "en",
            debug: false,
            interpolation: {
                escapeValue: false
            },
            ns: ["common", "landing-page", "setlist-search", "errors"],
            defaultNS: "common",
            detection: {
                order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
                caches: ["cookie"]
            }
        });
}

export default i18n;
