import Head from "next/head";
import { useTranslation } from "react-i18next";
import Layout from "@components/Layout";

/**
 * Renders a custom 404 error page.
 * It displays a friendly error message when a page is not found.
 */
export default function Custom404() {
    const { t: i18n } = useTranslation();
    // TODO: Make this page look good
    return (
        <Layout>
            <Head>
                <title>{i18n("errors:404")}</title>
            </Head>
            <h1>{i18n("errors:404PageMessage")}</h1>
        </Layout>
    );
}
