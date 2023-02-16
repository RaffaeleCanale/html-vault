import type { CipherOptions } from './CipherData';

export function generateRandomBytes(length: number): ArrayBuffer {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return bytes.buffer;
}

export async function generateKeyFromPassword(
    password: string,
    salt: ArrayBuffer,
    mode: 'encrypt' | 'decrypt',
    options: CipherOptions,
): Promise<CryptoKey> {
    const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: options.iterations,
            hash: 'SHA-1',
        },
        passwordKey,
        {
            name: 'AES-GCM',
            length: options.keySize * 8,
        },
        false,
        [mode],
    );
}
