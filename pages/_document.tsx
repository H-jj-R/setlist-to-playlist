/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { Head, Html, Main, NextScript } from "next/document";

/**
 * Custom Document component for the Next.js application.
 *
 * This file is used to augment the application's `<html>` and `<body>` tags.
 * It is only rendered on the server side and can be used to define
 * metadata, scripts, and other document-level configurations.
 *
 * @returns {JSX.Element} The rendered `Document` component.
 */
export default function Document(): JSX.Element {
    return (
        <Html lang="en">
            <Head>
                {/* Google AdSense Auto Ads */}
                <script
                    async
                    crossOrigin="anonymous"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1631429488585748"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
