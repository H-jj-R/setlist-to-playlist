/**
 *
 */
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Home() {
    const router = useRouter();

    const handleNavigation = () => {
        router.push("/setlist-search");
    };

    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6">Landing Page</h1>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={handleNavigation}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition"
                >
                    Go To Setlist Search
                </button>
            </div>
        </Layout>
    );
}
