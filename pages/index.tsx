import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Layout from "../components/Layout";
import HeroSection from "../components/LandingPageHeroSection";
import GenerateSetlistSection from "../components/LandingPageGenerateSetlistSection";
import InfoSection from "../components/LandingPageInfoSection";

/**
 * The landing page of the site.
 */
export default function Home() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <Layout>
                <div className="flex flex-col flex-grow">
                    <HeroSection />
                    <GenerateSetlistSection />
                    <InfoSection />
                </div>
            </Layout>
        </div>
    );
}
