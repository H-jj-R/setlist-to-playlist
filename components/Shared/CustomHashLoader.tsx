/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useTranslation } from "next-i18next";
import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

/**
 * Props for the `CustomHashLoader` component.
 *
 * @property {boolean} showLoading - Determines whether the loader should be displayed.
 * @property {number} size - The size of the loader.
 */
interface CustomHashLoaderProps {
    showLoading: boolean;
    size: number;
}

/**
 * **CustomHashLoader Component**
 *
 * A customised loading spinner using the `HashLoader` from `react-spinners`.
 *
 * @param CustomHashLoaderProps - The component props.
 *
 * @returns {JSX.Element} The rendered `CustomHashLoader` component.
 */
const CustomHashLoader: React.FC<CustomHashLoaderProps> = ({ showLoading, size }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <HashLoader
            id="hash-loader"
            aria-label={i18n("common:loading")}
            color="#3DDAFA"
            cssOverride={{} as CSSProperties}
            loading={showLoading}
            size={size}
        />
    );
};

export default CustomHashLoader;
