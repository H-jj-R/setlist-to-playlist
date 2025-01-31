import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

interface CustomHashLoaderProps {
    showLoading: boolean; // Indicates when the loader should be displayed
    size: number; // Size of the loader
}

/**
 * Custom hash loader.
 */
const CustomHashLoader: React.FC<CustomHashLoaderProps> = ({ showLoading, size }) => {
    const { t: i18n } = useTranslation();

    return (
        <HashLoader
            id="hash-loader"
            color="#3DDAFA"
            loading={showLoading}
            cssOverride={{} as CSSProperties}
            size={size}
            aria-label={i18n("common:loading")}
        />
    );
};

export default CustomHashLoader;
