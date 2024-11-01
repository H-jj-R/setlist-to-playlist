/**
 *
 */
import Link from "next/link";
import Layout from "../components/layouts/layout";

export default function Home() {
    return (
        <Layout>
            <h1>Landing Page</h1>
            <Link href="/setlist-search">Go To Setlist Search</Link>
        </Layout>
    );
}
