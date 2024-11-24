import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";

/**
 * The landing page of the site.
 */
export default function Home() {
    const router = useRouter();
    const { t: i18n } = useTranslation("landing-page");

    /**
     * Handles navigation to the "Setlist Search" page when the button is clicked.
     */
    const handleNavigation = () => {
        router.push("/setlist-search");
    };

    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6">{i18n("landingPageTitle")}</h1>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={handleNavigation}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition"
                >
                    {i18n("goToSetlistSearch")}
                </button>
            </div>
        </Layout>
    );
}
