import React, { useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import { CSSTransition } from "react-transition-group";
import utilStyles from "../styles/utils.module.css";

export default function SetlistSearch() {
    const [searchTriggered, setSearchTriggered] = useState(false);

    const handleSearch = async (query) => {
        if (query !== "") {
            if (!searchTriggered) {
                setSearchTriggered(true);
            }

            try {
                const response = await fetch(`/api/controllers/get-setlists?query=${query}`);

                if (!response.ok) {
                    throw new Error("There has been an error!"); // TODO: Make error messages more informative
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("error: ", error);
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
            </div>
        </Layout>
    );
}
