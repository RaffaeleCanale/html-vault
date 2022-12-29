import { describe, expect, test } from 'vitest';
import type { Vault } from '../model/Vault';
import { decodeVaultData, encodeVaultData } from './VaultDataEncoder';

function expectVaultDataToBeEqual(actual: Vault, expected: Vault) {
    expect(actual).toEqual(expected);

    for (let i = 0; i < actual.files.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const actualFile = actual.files[i]!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const expectedFile = expected.files[i]!;

        expect(new Uint8Array(actualFile.fileData)).toEqual(
            new Uint8Array(expectedFile.fileData),
        );
    }
}

describe('VaultDataEncoder', () => {
    test('convert back and forth is correct', () => {
        // GIVEN a vault data
        const data: Vault = {
            files: [
                {
                    name: 'file1',
                    type: 'text/plain',
                    fileData: new TextEncoder().encode('Hello, world!').buffer,
                },
                {
                    name: 'file2',
                    type: 'text/plain',
                    fileData: new TextEncoder().encode(
                        'The quick brown fox jumps over 13 lazy dogs.',
                    ).buffer,
                },
                {
                    name: 'file3',
                    type: 'text/plain',
                    fileData: new TextEncoder().encode('你好').buffer,
                },
            ],
        };

        // WHEN we encode it and then decode it
        const decoded = decodeVaultData(encodeVaultData(data));

        // THEN we get the expected result
        expectVaultDataToBeEqual(decoded, data);
    });

    test('encoding empty strings is correct', () => {
        // GIVEN a vault data with empty data
        const data: Vault = {
            files: [
                {
                    name: '',
                    type: '',
                    fileData: new Uint8Array(),
                },
            ],
        };

        // WHEN we encode it
        const encoded = encodeVaultData(data);

        // THEN we get the expected result
        expect(new Uint8Array(encoded)).toEqual(
            new Uint8Array([0, 2, 47, 47, 0, 0, 0, 0]),
        );
    });

    test('encoding 2 files is correct', () => {
        // GIVEN a vault data with 2 files
        const data: Vault = {
            files: [
                {
                    name: 'a',
                    type: 'b',
                    fileData: new Uint8Array([1, 2, 3]),
                },
                {
                    name: 'c',
                    type: 'd',
                    fileData: new Uint8Array([4, 5, 6]),
                },
            ],
        };

        // WHEN we encode it
        const encoded = encodeVaultData(data);

        // THEN we get the expected result
        expect(new Uint8Array(encoded)).toEqual(
            new Uint8Array([
                0,
                4, // metadata length
                97, // a
                47, // /
                47, // /
                98, // b
                0,
                0,
                0,
                3, // file data length
                1,
                2,
                3,
                0,
                4, // metadata length
                99, // c
                47, // /
                47, // /
                100, // d
                0,
                0,
                0,
                3, // file data length
                4,
                5,
                6,
            ]),
        );
    });

    test('decoding an empty file is correct', () => {
        // GIVEN an encoded vault data with an empty file
        const encoded = new Uint8Array([0, 2, 47, 47, 0, 0, 0, 0]);

        // WHEN we decode it
        const decoded = decodeVaultData(encoded.buffer);

        // THEN we get the expected result
        expectVaultDataToBeEqual(decoded, {
            files: [
                {
                    name: '',
                    type: '',
                    fileData: new Uint8Array().buffer,
                },
            ],
        });
    });

    test('decoding 2 files is correct', () => {
        // GIVEN an encoded vault data with 2 files
        const encoded = new Uint8Array([
            0, 4, 97, 47, 47, 98, 0, 0, 0, 3, 1, 2, 3, 0, 4, 99, 47, 47, 100, 0,
            0, 0, 3, 4, 5, 6,
        ]);

        // WHEN we decode it
        const decoded = decodeVaultData(encoded.buffer);

        // THEN we get the expected result
        expectVaultDataToBeEqual(decoded, {
            files: [
                {
                    name: 'a',
                    type: 'b',
                    fileData: new Uint8Array([1, 2, 3]).buffer,
                },
                {
                    name: 'c',
                    type: 'd',
                    fileData: new Uint8Array([4, 5, 6]).buffer,
                },
            ],
        });
    });
});
