import Layout from "../components/Layout";
import Head from "next/head";
import { useTranslation } from "react-i18next";

/**
 * Renders a custom 500 error page.
 * It displays a friendly error message for server-side issues.
 */
export default function Custom500() {
    const { t: i18n } = useTranslation();
    // TODO: Make this page look good
    return (
        <Layout>
            <Head>
                <title>{i18n("errors:500")}</title>
            </Head>
            <h1>{i18n("errors:500PageMessage")}</h1>
        </Layout>
    );
}
