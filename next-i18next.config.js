module.exports = {
    i18n: {
        locales: ["en", "es", "fr", "zh-cn"],
        defaultLocale: "en"
    },
    reloadOnPrerender: process.env.NODE_ENV === "development"
};
