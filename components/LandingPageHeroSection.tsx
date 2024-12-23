import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Hero section for landing page.
 */
const HeroSection: React.FC = () => {
    const router = useRouter();
    const { t: i18n } = useTranslation("landing-page");

    return (
        <div
            id="landing-page-hero"
            className="h-1/3 flex-shrink-0 bg-gradient-to-r from-pink-600 to-orange-500 text-white flex flex-col lg:flex-row items-center justify-between py-6 px-10"
        >
            <div id="landing-page-text" className="mb-6 lg:mb-0 lg:w-1/2">
                <h1 id="landing-page-title" className="text-4xl font-extrabold mb-4">
                    {i18n("landingPageTitle")}
                </h1>
                <p id="landing-page-description" className="text-lg mb-8">
                    {i18n("landingPageDescription")}
                </p>
            </div>
            <div id="setlist-search-button-container" className="lg:ml-auto lg:mr-auto">
                <button
                    id="go-to-setlist-search-button"
                    onClick={() => router.push("/setlist-search")}
                    className="px-12 py-5 bg-white text-pink-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 focus:outline-none transition text-lg"
                >
                    {i18n("goToSetlistSearch")}
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
