/**
 *
 */
import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
    return (
        <Layout>
            <h1>Landing Page</h1>
            <Link href="/setlist-search">Go To Setlist Search</Link>
        </Layout>
    );
}
