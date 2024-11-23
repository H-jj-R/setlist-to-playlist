import Layout from "../components/Layout";
import Head from "next/head";

/**
 * Renders a custom 500 error page.
 * It displays a friendly error message for server-side issues.
 */
export default function Custom500() {
    return (
        <Layout>
            <Head>
                <title>500</title>
            </Head>
            <h1>500 - Something Went Wrong!</h1>
        </Layout>
    );
}
