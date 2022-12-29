import { describe, expect, test } from 'vitest';
import { base64ToBytes, bytesToBase64 } from './Base64Encoder';

describe('Base64Encoder', () => {
    test('correctly encodes simple bytes', () => {
        // GIVEN a simple byte array
        const bytes = new Uint8Array([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        ]);

        // WHEN we encode it
        const encoded = bytesToBase64(bytes);

        // THEN we get the expected result
        expect(encoded).toEqual('AAECAwQFBgcICQoLDA0ODw==');
    });

    test('correctly decodes a string', () => {
        // GIVEN a base64 string
        const str =
            'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIDEzIGxhenkgZG9ncy4=';

        // WHEN we decode it
        const decoded = base64ToBytes(str);

        // THEN we get the expected result
        expect(decoded).toEqual(
            new Uint8Array([
                84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114, 111, 119,
                110, 32, 102, 111, 120, 32, 106, 117, 109, 112, 115, 32, 111,
                118, 101, 114, 32, 49, 51, 32, 108, 97, 122, 121, 32, 100, 111,
                103, 115, 46,
            ]),
        );
    });

    test('correctly converts back and forth', () => {
        // GIVEN a byte array
        const str = 'Hello, world with special chars: 你好';
        const bytes = new TextEncoder().encode(str);

        // WHEN we encode it and then decode it
        const decoded = base64ToBytes(bytesToBase64(bytes));

        // THEN we get the expected result
        expect(decoded).toEqual(bytes);
        expect(new TextDecoder().decode(decoded)).toEqual(str);
    });
});
