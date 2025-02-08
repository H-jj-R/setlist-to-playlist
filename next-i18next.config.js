module.exports = {
    i18n: {
        locales: ["ar", "de", "en", "es", "fi", "fr", "hi", "zh-cn"],
        defaultLocale: "en"
    },
    reloadOnPrerender: process.env.NODE_ENV === "development"
};
