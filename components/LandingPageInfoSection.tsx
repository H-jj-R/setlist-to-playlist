import { useTranslation } from "react-i18next";

/**
 * Info section under hero section on landing page.
 */
const InfoSection: React.FC = () => {
    const { t: i18n } = useTranslation();

    return (
        <div
            id="why-create-account-section"
            className="flex-grow min-h-[1/3] bg-gradient-to-b from-green-500 to-green-600 text-gray-100 py-6 px-10"
        >
            <div id="why-create-account-container" className="max-w-4xl mx-auto">
                <h2 id="why-create-account-title" className="text-3xl font-bold text-center mb-6">
                    {i18n("landingPage:whyCreateAccountTitle")}
                </h2>
                <div id="feature-cards-container" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        id="feature-card-1"
                        className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl"
                    >
                        <h3 id="feature-1-title" className="text-xl font-bold mb-4">
                            {i18n("landingPage:feature1Title")}
                        </h3>
                        <p id="feature-1-description">{i18n("landingPage:feature1Description")}</p>
                    </div>
                    <div
                        id="feature-card-2"
                        className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl"
                    >
                        <h3 id="feature-2-title" className="text-xl font-bold mb-4">
                            {i18n("landingPage:feature2Title")}
                        </h3>
                        <p id="feature-2-description">{i18n("landingPage:feature2Description")}</p>
                    </div>
                    <div
                        id="feature-card-3"
                        className="border-2 border-gray-300 rounded-lg shadow-lg p-6 text-center transition hover:shadow-xl"
                    >
                        <h3 id="feature-3-title" className="text-xl font-bold mb-4">
                            {i18n("landingPage:feature3Title")}
                        </h3>
                        <p id="feature-3-description">{i18n("landingPage:feature3Description")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
