import type { CipherData, CipherOptions } from './CipherData';
import { generateKeyFromPassword, generateRandomBytes } from './KeyUtils';

export function getDefaultOptions(): CipherOptions {
    return {
        blockSize: 16,
        saltSize: 16,
        iterations: 1000000,
        keySize: 32,
    };
}

export async function encrypt(
    input: ArrayBuffer,
    passwordStr: string,
    options: CipherOptions = getDefaultOptions(),
): Promise<CipherData> {
    const salt = generateRandomBytes(options.saltSize);
    const key = await generateKeyFromPassword(
        passwordStr,
        salt,
        'encrypt',
        options,
    );

    const iv = generateRandomBytes(options.blockSize);

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        input,
    );

    return {
        options,
        salt,
        iv,
        encryptedData: cipherBuffer,
    };
}

export async function decrypt(
    data: CipherData,
    passwordStr: string,
): Promise<ArrayBuffer> {
    const key = await generateKeyFromPassword(
        passwordStr,
        data.salt,
        'decrypt',
        data.options,
    );

    return await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: data.iv,
        },
        key,
        data.encryptedData,
    );
}
