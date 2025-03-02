import { Buffer } from 'buffer';

/**
 * Creates an HMAC signature using the Web Crypto API
 * @param message - The message to sign
 * @param key - The secret key
 * @returns Promise<string> - The HMAC signature
 */
export async function createHmac(message: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Create the signature
    const signature = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
    );

    // Convert to Base64
    return Buffer.from(new Uint8Array(signature)).toString('base64');
}

/**
 * Generates a random string of specified length
 * @param length - The length of the random string
 * @returns string - The random string
 */
export function generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
} 