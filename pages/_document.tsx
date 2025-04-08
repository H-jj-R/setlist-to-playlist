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
 * @returns The rendered `Document` component.
 */
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <>{process.env.NODE_ENV === "production" && <link href="/manifest.json" rel="manifest" />}</>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
