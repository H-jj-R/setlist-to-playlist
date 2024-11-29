import { useTranslation } from "react-i18next";

interface InfoSectionProps {
    theme: string | undefined;
}

const InfoSection = ({ theme }: InfoSectionProps) => {
    const { t: i18n } = useTranslation("landing-page");

    // TODO: Figure out why this doesn't go to bottom of screen
    // TODO: Add button to create account
    return (
        <div
            className={`flex-grow py-16 px-10 ${
                theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
            }`}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6">{i18n("whyCreateAccountTitle")}</h2>
                <p className="text-lg text-center mb-12">{i18n("whyCreateAccountDescription")}</p>
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
