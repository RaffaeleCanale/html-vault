import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import { decrypt, encrypt, getDefaultOptions } from './Encrypter';

describe('Encrypter', () => {
    test('encrypting and decrypting is correct', async () => {
        // GIVEN encrypted data
        const data = await encrypt(a([1, 2, 3]), 'password', {
            ...getDefaultOptions(),
            iterations: 100,
        });

        // WHEN decrypting the data
        const decrypted = await decrypt(data, 'password');

        // THEN the decrypted data is the same as the original data
        expect(decrypted).toEqual(a([1, 2, 3]));
    });

    test('encrypting and decrypting with the wrong password throws an error', async () => {
        // GIVEN encrypted data
        const data = await encrypt(a([1, 2, 3]), 'password', {
            ...getDefaultOptions(),
            iterations: 100,
        });

        // WHEN decrypting the data with the wrong password
        // THEN an error is thrown
        await expect(decrypt(data, 'wrong password')).rejects.toThrow();
    });

    test('encrypting and decrypting with an empty password works', async () => {
        // GIVEN encrypted data
        const data = await encrypt(a([1, 2, 3]), '', {
            ...getDefaultOptions(),
            iterations: 100,
        });

        // WHEN decrypting the data
        const decrypted = await decrypt(data, '');

        // THEN the decrypted data is the same as the original data
        expect(decrypted).toEqual(a([1, 2, 3]));
    });
});
