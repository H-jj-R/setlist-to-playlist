import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
    const router = useRouter();
    const { t: i18n } = useTranslation("landing-page");

    const handleNavigation = () => {
        router.push("/setlist-search");
    };

    return (
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-green-600 text-white py-24 px-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:w-1/2">
                <h1 className="text-4xl font-extrabold mb-4">{i18n("landingPageTitle")}</h1>
                <p className="text-lg mb-8">{i18n("landingPageDescription")}</p>
            </div>
            <div className="lg:ml-auto lg:mr-auto">
                <button
                    onClick={handleNavigation}
                    className="px-12 py-5 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 focus:outline-none transition text-lg"
                >
                    {i18n("goToSetlistSearch")}
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
