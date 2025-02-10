/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useTranslation } from "next-i18next";
import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

interface CustomHashLoaderProps {
    showLoading: boolean; // Indicates when the loader should be displayed
    size: number; // Size of the loader
}

/**
 * Custom hash loader.
 */
const CustomHashLoader: React.FC<CustomHashLoaderProps> = ({ showLoading, size }): JSX.Element => {
    const { t: i18n } = useTranslation();

    return (
        <HashLoader
            cssOverride={{} as CSSProperties}
            id="hash-loader"
            aria-label={i18n("common:loading")}
            color="#3DDAFA"
            loading={showLoading}
            size={size}
        />
    );
};

export default CustomHashLoader;
