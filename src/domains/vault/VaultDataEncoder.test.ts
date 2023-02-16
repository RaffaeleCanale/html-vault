import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import type { Vault } from './Vault';
import { decodeVaultData, encodeVaultData } from './VaultDataEncoder';

function expectVaultDataToBeEqual(actual: Vault, expected: Vault) {
    expect(actual).toEqual(expected);

    for (let i = 0; i < actual.files.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const actualFile = actual.files[i]!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const expectedFile = expected.files[i]!;

        expect(actualFile.data).toEqual(expectedFile.data);
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
                    data: new TextEncoder().encode('Hello, world!').buffer,
                },
                {
                    name: 'file2',
                    type: 'text/plain',
                    data: new TextEncoder().encode(
                        'The quick brown fox jumps over 13 lazy dogs.',
                    ).buffer,
                },
                {
                    name: 'file3',
                    type: 'text/plain',
                    data: new TextEncoder().encode('你好').buffer,
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
                    data: a([]),
                },
            ],
        };

        // WHEN we encode it
        const encoded = encodeVaultData(data);

        // THEN we get the expected result
        expect(encoded).toEqual(a([0, 0, 0, 0, 0, 0, 0, 0]));
    });

    test('encoding 2 files is correct', () => {
        // GIVEN a vault data with 2 files
        const data: Vault = {
            files: [
                {
                    name: 'a',
                    type: 'b',
                    data: a([1, 2, 3]),
                },
                {
                    name: 'c',
                    type: 'd',
                    data: a([4, 5, 6]),
                },
            ],
        };

        // WHEN we encode it
        const encoded = encodeVaultData(data);

        // THEN we get the expected result
        expect(encoded).toEqual(
            a([
                0,
                1, // name length
                97, // a
                0,
                1, // type length
                98, // b
                0,
                0,
                0,
                3, // file data length
                1,
                2,
                3,
                0,
                1, // nane length
                99, // c
                0,
                1, // type length
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
        const encoded = a([0, 0, 0, 0, 0, 0, 0, 0]);

        // WHEN we decode it
        const decoded = decodeVaultData(encoded);

        // THEN we get the expected result
        expectVaultDataToBeEqual(decoded, {
            files: [
                {
                    name: '',
                    type: '',
                    data: a([]),
                },
            ],
        });
    });

    test('decoding 2 files is correct', () => {
        // GIVEN an encoded vault data with 2 files
        const encoded = a([
            0, 1, 97, 0, 1, 98, 0, 0, 0, 3, 1, 2, 3, 0, 1, 99, 0, 1, 100, 0, 0,
            0, 3, 4, 5, 6,
        ]);

        // WHEN we decode it
        const decoded = decodeVaultData(encoded);

        // THEN we get the expected result
        expectVaultDataToBeEqual(decoded, {
            files: [
                {
                    name: 'a',
                    type: 'b',
                    data: a([1, 2, 3]),
                },
                {
                    name: 'c',
                    type: 'd',
                    data: a([4, 5, 6]),
                },
            ],
        });
    });
});
