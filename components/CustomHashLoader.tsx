import React, { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

interface CustomHashLoaderProps {
    showLoading: boolean; // Indicates when the loader should be displayed
    size: number; // Size of the loader
}

/**
 * Custom hash loader.
 */
const CustomHashLoader = ({ showLoading, size }: CustomHashLoaderProps) => {
    return (
        <HashLoader
            color="#36d7c0"
            loading={showLoading}
            cssOverride={{} as CSSProperties}
            size={size}
            aria-label="Loader"
            data-testid="loader"
        />
    );
};

export default CustomHashLoader;
