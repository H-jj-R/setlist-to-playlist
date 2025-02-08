import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationAr from "@locales/ar/translation.json";
import translationDe from "@locales/de/translation.json";
import translationEn from "@locales/en/translation.json";
import translationEs from "@locales/es/translation.json";
import translationFi from "@locales/fi/translation.json";
import translationFr from "@locales/fr/translation.json";
import translationHi from "@locales/hi/translation.json";
import translationZhCn from "@locales/zh-cn/translation.json";

if (!i18n.isInitialized) {
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources: {
                ar: translationAr,
                de: translationDe,
                en: translationEn,
                es: translationEs,
                fi: translationFi,
                fr: translationFr,
                hi: translationHi,
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
                "exportSetlist",
                "generateSetlist",
                "landingPage",
                "privacyPolicy",
                "setlistSearch",
                "settings",
                "userPlaylists"
            ],
            detection: {
                order: ["querystring", "navigator", "htmlTag"]
            }
        });
}

export default i18n;
