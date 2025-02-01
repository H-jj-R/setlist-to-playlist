import { useEffect, useState } from "react";
import GenerateSetlistSection from "@components/LandingPageGenerateSetlistSection";
import HeroSection from "@components/LandingPageHeroSection";
import InfoSection from "@components/LandingPageInfoSection";
import Layout from "@components/Layout";

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
        <div className="flex flex-col min-h-screen">
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
