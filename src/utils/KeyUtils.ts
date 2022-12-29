export interface KeyOptions {
    salt: Uint8Array;
    iterations: number;
    keySize: number;
}

export function defaultKeyOptions(): KeyOptions {
    return {
        salt: generateRandomBytes(16),
        iterations: 1000000,
        keySize: 32,
    };
}

export function generateRandomBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return bytes;
}

export async function generateKeyFromPassword(
    password: string,
    mode: 'encrypt' | 'decrypt',
    options: KeyOptions,
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
            salt: options.salt,
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
