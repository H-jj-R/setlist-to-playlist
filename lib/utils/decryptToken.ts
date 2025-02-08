/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import CryptoJS from "crypto-js";

/**
 * Decrypts an encrypted token using AES decryption.
 *
 * @param {string} encryptedToken - The encrypted token string.
 * @returns {string} - The decrypted token.
 */
export default function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY!); // Decrypt using the encryption key from environment variables
    return bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to a UTF-8 string
}
