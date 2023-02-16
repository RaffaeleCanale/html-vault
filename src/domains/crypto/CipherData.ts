/**
 * Object containing an encrypted message and all the options/parameters used to encrypt it.
 */
export interface CipherData {
    options: CipherOptions;
    salt: ArrayBuffer;
    iv: ArrayBuffer;
    encryptedData: ArrayBuffer;
}

export interface CipherOptions {
    blockSize: number; // bytes (for AES, IV)
    saltSize: number; // bytes (for PBKDF2)
    iterations: number; // key derivation (with PBKDF2)
    keySize: number; // bytes (derived with PBKDF2, used by AES)
}
