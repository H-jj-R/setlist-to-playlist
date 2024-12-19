import { useTranslation } from "react-i18next";

/**
 * Info section under hero section on landing page.
 */
const InfoSection = () => {
    const { t: i18n } = useTranslation("landing-page");

    return (
        <div className="h-1/3 flex-shrink-0 bg-gradient-to-b from-green-500 to-green-600 text-gray-100 py-6 px-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6">{i18n("whyCreateAccountTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl">
                        <h3 className="text-xl font-bold mb-4">{i18n("feature1Title")}</h3>
                        <p>{i18n("feature1Description")}</p>
                    </div>
                    <div className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl">
                        <h3 className="text-xl font-bold mb-4">{i18n("feature2Title")}</h3>
                        <p>{i18n("feature2Description")}</p>
                    </div>
                    <div className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl">
                        <h3 className="text-xl font-bold mb-4">{i18n("feature3Title")}</h3>
                        <p>{i18n("feature3Description")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
