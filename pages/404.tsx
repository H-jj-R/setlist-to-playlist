import Layout from "../components/Layout";
import Head from "next/head";
import { useTranslation } from "react-i18next";

/**
 * Renders a custom 404 error page.
 * It displays a friendly error message when a page is not found.
 */
export default function Custom404() {
    const { t: i18nErrors } = useTranslation("errors");

    return (
        <Layout>
            <Head>
                <title>{i18nErrors("404")}</title>
            </Head>
            <h1>{i18nErrors("404PageMessage")}</h1>
        </Layout>
    );
}
