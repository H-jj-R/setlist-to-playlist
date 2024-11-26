import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

/**
 * The landing page of the site.
 */
export default function Home() {
    const router = useRouter();
    const { t: i18n } = useTranslation("landing-page");
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure we only render the theme-dependent content after the client has mounted
    useEffect(() => {
        setMounted(true);
    }, [resolvedTheme]);

    /**
     * Handles navigation to the "Setlist Search" page when the button is clicked.
     */
    const handleNavigation = () => {
        router.push("/setlist-search");
    };

    // Prevent rendering until the component has mounted
    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <Layout>
                {/* Hero Section */}
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

                {/* Info Section TODO: FIGURE OUT WHY THIS DOESN'T GO TO BOTTOM OF SCREEN*/}
                <div
                    className={`flex-grow py-16 px-10 ${
                        resolvedTheme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
                    }`}
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-6">{i18n("whyCreateAccountTitle")}</h2>
                        <p className="text-lg text-center mb-12">{i18n("whyCreateAccountDescription")}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-opacity-50 rounded-lg shadow-lg p-6 text-center transition">
                                <h3 className="text-xl font-bold mb-4">{i18n("feature1Title")}</h3>
                                <p>{i18n("feature1Description")}</p>
                            </div>
                            <div className="bg-opacity-50 rounded-lg shadow-lg p-6 text-center transition">
                                <h3 className="text-xl font-bold mb-4">{i18n("feature2Title")}</h3>
                                <p>{i18n("feature2Description")}</p>
                            </div>
                            <div className="bg-opacity-50 rounded-lg shadow-lg p-6 text-center transition">
                                <h3 className="text-xl font-bold mb-4">{i18n("feature3Title")}</h3>
                                <p>{i18n("feature3Description")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}
