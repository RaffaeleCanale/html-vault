import crypto from 'crypto';
import { describe, expect, test } from 'vitest';
import { decrypt, encrypt } from './Encrypter';

Object.defineProperty(globalThis, 'window', {
    value: { crypto },
});

describe('Encrypter', () => {
    test('encrypting and decrypting is correct', async () => {
        // GIVEN encrypted data
        const data = await encrypt(new Uint8Array([1, 2, 3]), 'password');

        // WHEN decrypting the data
        const decrypted = new Uint8Array(await decrypt(data, 'password'));

        // THEN the decrypted data is the same as the original data
        expect(decrypted).toEqual(new Uint8Array([1, 2, 3]));
    });

    test('encrypting and decrypting with the wrong password throws an error', async () => {
        // GIVEN encrypted data
        const data = await encrypt(new Uint8Array([1, 2, 3]), 'password');

        // WHEN decrypting the data with the wrong password
        // THEN an error is thrown
        await expect(decrypt(data, 'wrong password')).rejects.toThrow();
    });

    test('encrypting and decrypting with an empty password works', async () => {
        // GIVEN encrypted data
        const data = await encrypt(new Uint8Array([1, 2, 3]), '');

        // WHEN decrypting the data
        const decrypted = new Uint8Array(await decrypt(data, ''));

        // THEN the decrypted data is the same as the original data
        expect(decrypted).toEqual(new Uint8Array([1, 2, 3]));
    });
});
