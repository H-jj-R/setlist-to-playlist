/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */
import { useTranslation } from "react-i18next";

/**
 * **AccountInfoSection Component**
 *
 * Displays information on why to create an account.
 *
 * @returns The rendered `AccountInfoSection` component.
 */
const AccountInfoSection: React.FC<{}> = () => {
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div
            id="why-create-account-section"
            className="min-h-[33.333333%] grow bg-linear-to-b from-green-500 to-green-600 px-10 py-6 text-gray-100"
        >
            <div id="why-create-account-container" className="mx-auto max-w-4xl">
                <h2 id="why-create-account-title" className="mb-6 text-center text-3xl font-bold">
                    {i18n("landingPage:whyCreateAccountTitle")}
                </h2>
                <div id="feature-cards-container" className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div
                        id="feature-card-1"
                        className="rounded-lg border-2 border-gray-300 p-4 text-center shadow-lg transition hover:shadow-xl"
                    >
                        <h3 id="feature-1-title" className="mb-4 text-xl font-bold">
                            {i18n("landingPage:feature1Title")}
                        </h3>
                        <p id="feature-1-description">{i18n("landingPage:feature1Description")}</p>
                    </div>
                    <div
                        id="feature-card-2"
                        className="rounded-lg border-2 border-gray-300 p-4 text-center shadow-lg transition hover:shadow-xl"
                    >
                        <h3 id="feature-2-title" className="mb-4 text-xl font-bold">
                            {i18n("landingPage:feature2Title")}
                        </h3>
                        <p id="feature-2-description">{i18n("landingPage:feature2Description")}</p>
                    </div>
                    <div
                        id="feature-card-3"
                        className="rounded-lg border-2 border-gray-300 p-4 text-center shadow-lg transition hover:shadow-xl"
                    >
                        <h3 id="feature-3-title" className="mb-4 text-xl font-bold">
                            {i18n("landingPage:feature3Title")}
                        </h3>
                        <p id="feature-3-description">{i18n("landingPage:feature3Description")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfoSection;
