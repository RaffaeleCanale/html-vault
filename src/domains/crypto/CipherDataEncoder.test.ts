import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import type { CipherData } from './CipherData';
import { decodeCipherData, encodeCipherData } from './CipherDataEncoder';
import { generateRandomBytes } from './KeyUtils';

describe('CipherDataEncoder', () => {
    describe('#encodeCipherData', () => {
        test('encoding data is correct', () => {
            // GIVEN a cipher data
            const data: CipherData = {
                options: {
                    blockSize: 3,
                    saltSize: 2,
                    iterations: 1,
                    keySize: 4,
                },
                salt: a([5, 6]),
                iv: a([8, 9, 10]),
                encryptedData: a([11, 12, 13]),
            };

            // WHEN encoding the data
            const encoded = encodeCipherData(data);

            // THEN we get the expected result
            expect(encoded).toEqual(
                a([
                    0, 3, 0, 2, 0, 0, 0, 1, 0, 0, 0, 4, 5, 6, 8, 9, 10, 11, 12,
                    13,
                ]),
            );
        });

        test('if the block size does not match the IV size, throw an exception', () => {
            // GIVEN a cipher data with an invalid IV size
            const data: CipherData = {
                options: {
                    blockSize: 3,
                    saltSize: 2,
                    iterations: 1,
                    keySize: 4,
                },
                salt: a([5, 6]),
                iv: a([8, 9]),
                encryptedData: a([11, 12, 13]),
            };

            // WHEN encoding the data
            // THEN an exception is thrown
            expect(() => encodeCipherData(data)).toThrowError();
        });

        test('if the salt size does not match the salt array, throw an exception', () => {
            // GIVEN a cipher data with an invalid salt size
            const data: CipherData = {
                options: {
                    blockSize: 3,
                    saltSize: 2,
                    iterations: 1,
                    keySize: 4,
                },
                salt: a([5, 6, 7]),
                iv: a([8, 9, 10]),
                encryptedData: a([11, 12, 13]),
            };

            // WHEN encoding the data
            // THEN an exception is thrown
            expect(() => encodeCipherData(data)).toThrowError();
        });
    });

    describe('#decodeCipherData', () => {
        test('decoding data is correct', () => {
            // GIVEN an encoded cipher data
            const encoded = a([
                0, 3, 0, 2, 0, 0, 0, 1, 0, 0, 0, 4, 5, 6, 8, 9, 10, 11, 12, 13,
            ]);

            // WHEN decoding the data
            const decoded = decodeCipherData(encoded);

            // THEN we get the expected result
            expect(decoded.options).toEqual({
                blockSize: 3,
                saltSize: 2,
                iterations: 1,
                keySize: 4,
            });
            expect(decoded.salt).toEqual(a([5, 6]));
            expect(decoded.iv).toEqual(a([8, 9, 10]));
            expect(decoded.encryptedData).toEqual(a([11, 12, 13]));
        });
    });

    describe('#encodeCipherData and #decodeCipherData', () => {
        test('encoding and decoding data is correct', () => {
            // GIVEN a cipher data
            const data: CipherData[] = [
                {
                    options: {
                        blockSize: 3,
                        saltSize: 2,
                        iterations: 1,
                        keySize: 4,
                    },
                    salt: a([5, 6]),
                    iv: a([8, 9, 10]),
                    encryptedData: a([11, 12, 13]),
                },
                {
                    options: {
                        blockSize: 2048,
                        saltSize: 1024,
                        iterations: 1000000,
                        keySize: 2018,
                    },
                    salt: generateRandomBytes(1024),
                    iv: generateRandomBytes(2048),
                    encryptedData: a([11, 12, 13]),
                },
            ];

            data.forEach((d) => {
                // WHEN encoding and decoding the data
                const decoded = decodeCipherData(encodeCipherData(d));

                // THEN we get the expected result
                expect(decoded.options).toEqual(d.options);
                expect(decoded.salt).toEqual(d.salt);
                expect(decoded.iv).toEqual(d.iv);
                expect(decoded.encryptedData).toEqual(d.encryptedData);
            });
        });
    });
});
