import { useTranslation } from "react-i18next";
import Layout from "@components/Shared/Layout";

/**
 * Renders a custom 404 error page.
 * It displays a friendly error message when a page is not found.
 */
export default function Custom404() {
    const { t: i18n } = useTranslation();
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-1/3 text-center">
                <h1 className="text-4xl font-bold mb-4">{i18n("errors:404PageTitle")}</h1>
                <h2 className="text-xl mb-6">{i18n("errors:404PageMessage")}</h2>
            </div>
        </Layout>
    );
}
