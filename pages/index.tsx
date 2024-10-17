import Head from "next/head";
import Layout from "../components/layout";
import { SITE_TITLE } from "./_app";

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>
        </Layout>
    );
}
