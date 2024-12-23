import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Generate Setlist section for landing page.
 */
const GenerateSetlistSection: React.FC = () => {
    const router = useRouter();
    const { t: i18n } = useTranslation("landing-page");

    return (
        <div
            id="generate-setlist-hero"
            className="h-1/3 flex-shrink-0 bg-gradient-to-r from-sky-500 to-purple-700 text-white flex flex-col lg:flex-row items-center justify-between py-6 px-10"
        >
            <div id="generate-setlist-button-container" className="order-last lg:order-first lg:ml-auto lg:mr-auto">
                <button
                    id="go-to-ai-generate-setlist-button"
                    onClick={() => router.push("/ai-generate-setlist")}
                    className="px-12 py-5 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 focus:outline-none transition text-lg mb-8 lg:mb-0"
                >
                    {i18n("goToAIGenerateSetlist")}
                </button>
            </div>
            <div id="generate-setlist-text" className="lg:w-1/2 text-center lg:text-right">
                <h1 id="generate-setlist-title" className="text-4xl font-extrabold mb-4">
                    {i18n("generateSetlistTitle")}
                </h1>
                <p id="generate-setlist-description" className="text-lg">
                    {i18n("generateSetlistDescription")}
                </p>
            </div>
        </div>
    );
};

export default GenerateSetlistSection;
