import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import type { FilePart } from './FilePart';
import { decodeFilePart, encodeFilePart } from './FilePartEncoder';

describe('FilePartEncoder', () => {
    function tableTest(parts: FilePart[]): void {
        parts.forEach((part, i) => {
            test(`Test encode/decode part #${i + 1}`, () => {
                // When
                const encoded = encodeFilePart(part);
                const decoded = decodeFilePart(encoded);

                expect(decoded).toEqual(part);
            });
        });
    }

    tableTest([
        {
            data: a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
            index: 0,
            size: 15,
        },

        {
            data: a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
            index: 0,
            size: 13,
        },
        {
            data: a([]),
            index: 10,
            size: 0,
        },
    ]);
});
