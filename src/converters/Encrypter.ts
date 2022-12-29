import type { CipherData } from '../model/CipherData';
import {
    defaultKeyOptions,
    generateKeyFromPassword,
    generateRandomBytes,
    KeyOptions,
} from '../utils/KeyUtils';

const Settings = {
    blockSize: 16, // bytes (for AES, IV)
    saltSize: 16, // bytes (for PBKDF2)
    iterations: 1000000, // key derivation (with PBKDF2)
    keySize: 32, // bytes (derived with PBKDF2, used by AES)
} as const;

export async function encrypt(
    input: ArrayBuffer,
    passwordStr: string,
    keyOptions: KeyOptions = defaultKeyOptions(),
): Promise<CipherData> {
    const key = await generateKeyFromPassword(
        passwordStr,
        'encrypt',
        keyOptions,
    );

    const iv = generateRandomBytes(Settings.blockSize);

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        input,
    );

    return {
        keyOptions,
        iv,
        encryptedData: new Uint8Array(cipherBuffer),
    };
}

export async function decrypt(
    data: CipherData,
    passwordStr: string,
): Promise<ArrayBuffer> {
    const key = await generateKeyFromPassword(
        passwordStr,
        'decrypt',
        data.keyOptions,
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
