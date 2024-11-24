import Layout from "../components/Layout";
import Head from "next/head";
import { useTranslation } from "react-i18next";

/**
 * Renders a custom 500 error page.
 * It displays a friendly error message for server-side issues.
 */
export default function Custom500() {
    const { t: i18nErrors } = useTranslation("errors");

    return (
        <Layout>
            <Head>
                <title>{i18nErrors("500")}</title>
            </Head>
            <h1>{i18nErrors("500PageMessage")}</h1>
        </Layout>
    );
}
