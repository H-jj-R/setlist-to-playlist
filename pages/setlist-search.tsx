/**
 *
 */
import Link from "next/link";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";

export default function SetlistSearch() {
    return (
        <Layout>
            <h1>Search Page</h1>
            <p>
                This page will be for the main functionality of the site - searching then displaying a list of setlists
                to choose from.
            </p>
            <Link href="/">Back to Home</Link>
            {/* <p className="padding:400px;"></p> */}
            <div className="p-5">
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
        </Layout>
    );
}

const handleSearch = (query) => {
    console.log("Searched: ", query);

    // TODO: Move directly up
    // TODO: Get setlist data
    // TODO: Add ListOfSetlists

    // TODO: If setlist.fm link is provided, just display the setlist in screen centre
};
