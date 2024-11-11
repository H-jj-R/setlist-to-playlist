/**
 *
 */
import Layout from "../components/Layout";
import Head from "next/head";

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
