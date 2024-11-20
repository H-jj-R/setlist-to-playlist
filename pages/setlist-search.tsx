import React, { useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ListOfSetlists from "../components/ListOfSetlists";
import { CSSTransition } from "react-transition-group";
import utilStyles from "../styles/utils.module.css";

export default function SetlistSearch() {
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false);
    const [setlistData, setSetlistData] = useState([]);

    const handleSearch = async (query: string) => {
        if (query !== "") {
            setSearchComplete(false);
            if (!searchTriggered) {
                setSearchTriggered(true);
            }

            if (query.startsWith("https://www.setlist.fm/setlist/")) {
                try {
                    const setlistId = query.substring(query.lastIndexOf("-") + 1, query.lastIndexOf(".html"));
                    const response = await fetch(`/api/setlist-fm/setlist-setlistid?setlistId=${setlistId}`);

                    if (!response.ok) {
                        throw new Error("There has been an error!");
                    }

                    const data = await response.json();
                    console.log(data);
                    // TODO: Set setlist data for link
                } catch (error) {
                    console.error("error: ", error);
                }
            } else {
                try {
                    const response = await fetch(`/api/controllers/get-setlists?query=${query}`);

                    if (!response.ok) {
                        throw new Error("There has been an error!");
                    }

                    const data = await response.json();

                    setSetlistData(data);
                    setSearchComplete(true);
                } catch (error) {
                    console.error("error: ", error);
                }
            }
        }
    };

    return (
        <Layout>
            <div className="p-5">
                <CSSTransition
                    in={searchTriggered}
                    timeout={750}
                    classNames={{
                        enter: utilStyles["searchbar-enter"],
                        enterActive: utilStyles["searchbar-enter-active"],
                        enterDone: utilStyles["searchbar-enter-done"]
                    }}
                >
                    <div className={utilStyles.searchbar}>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </CSSTransition>
                {searchComplete && (
                    <div className="pt-8 w-4/5 max-w-3xl mx-auto">
                        <ListOfSetlists setlistData={setlistData} />
                    </div>
                )}
            </div>
        </Layout>
    );
}
