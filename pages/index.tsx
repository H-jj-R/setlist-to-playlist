/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import GenerateSetlistSection from "@components/LandingPage/LandingPageGenerateSetlistSection";
import HeroSection from "@components/LandingPage/LandingPageHeroSection";
import InfoSection from "@components/LandingPage/LandingPageInfoSection";
import Layout from "@components/Shared/Layout";
import { useEffect, useState } from "react";

/**
 * The landing page of the site.
 */
export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex min-h-screen flex-col">
            <Layout>
                <div className="flex-grow">
                    <HeroSection />
                    <GenerateSetlistSection />
                    <InfoSection />
                </div>
            </Layout>
        </div>
    );
}
