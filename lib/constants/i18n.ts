import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEn from "@locales/en/translation.json";
import translationEs from "@locales/es/translation.json";
import translationFi from "@locales/fi/translation.json";
import translationFr from "@locales/fr/translation.json";
import translationZhCn from "@locales/zh-cn/translation.json";

if (!i18n.isInitialized) {
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                en: translationEn,
                es: translationEs,
                fi: translationFi,
                fr: translationFr,
                "zh-cn": translationZhCn
            },
            fallbackLng: "en",
            debug: false,
            interpolation: {
                escapeValue: false
            },
            ns: [
                "common",
                "about",
                "account",
                "errors",
                "exportSetlist",
                "generateSetlist",
                "landingPage",
                "setlistSearch",
                "settings",
                "userPlaylists"
            ],
            detection: {
                order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
                caches: ["cookie"]
            }
        });
}

export default i18n;
