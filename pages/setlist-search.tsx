/**
 *
 */
import Link from "next/link";
import Layout from "../components/layouts/layout";

export default function SetlistSearch() {
    return (
        <Layout>
            <h1>Search Page</h1>
            <p>
                This page will be for the main functionality of the site - searching then displaying a list of setlists
                to choose from.
            </p>
            <Link href="/">Back to Home</Link>
        </Layout>
    );
}
