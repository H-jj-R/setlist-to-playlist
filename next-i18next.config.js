module.exports = {
    i18n: {
        locales: ["en", "es", "fi", "fr", "zh-cn"],
        defaultLocale: "en"
    },
    reloadOnPrerender: process.env.NODE_ENV === "development"
};
