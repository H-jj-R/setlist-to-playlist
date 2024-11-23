import Layout from "../components/Layout";
import Head from "next/head";

/**
 * Renders a custom 404 error page.
 * It displays a friendly error message when a page is not found.
 */
export default function Custom404() {
    return (
        <Layout>
            <Head>
                <title>404</title>
            </Head>
            <h1>404 - Page Not Found!</h1>
        </Layout>
    );
}
