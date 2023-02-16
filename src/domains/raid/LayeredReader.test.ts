import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import { useLayeredReader, useLayeredWriter } from './LayeredReader';

describe('LayeredReader', () => {
    describe('#useLayeredReader', () => {
        test('if the data is empty, returns empty', () => {
            const data = a([]);

            const reader = useLayeredReader(data);

            expect(reader.hasMore()).toBe(false);
            expect(() => reader.readLayer()).toThrow();
        });

        test('if the data is multiple of 3, reads correctly', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            const reader = useLayeredReader(data);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([1, 2, 3, 0]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([4, 5, 7, 6]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([7, 6, 8, 9]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([13, 10, 11, 12]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([13, 14, 15, 12]);

            expect(reader.hasMore()).toBe(false);
        });

        test('if the data is not multiple of 3, certain parts return null', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

            const reader = useLayeredReader(data);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([1, 2, 3, 0]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([4, 5, 7, 6]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([7, 6, 8, 9]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([13, 10, 11, 12]);

            expect(reader.hasMore()).toBe(true);
            expect(reader.readLayer()).toEqual([13, null, null, 13]);

            expect(reader.hasMore()).toBe(false);
        });
    });

    describe('#useLayeredWriter', () => {
        test('if the data is empty, returns empty', () => {
            const writer = useLayeredWriter(0);

            expect(writer.getData()).toEqual(a([]));
        });

        test('if the data is multiple of 3, writes correctly', () => {
            for (let i = 0; i < 4; i++) {
                const writer = useLayeredWriter(15);

                writer.writeLayer([1, 2, 3, 0], i);
                writer.writeLayer([4, 5, 7, 6], i);
                writer.writeLayer([7, 6, 8, 9], i);
                writer.writeLayer([13, 10, 11, 12], i);
                writer.writeLayer([13, 14, 15, 12], i);

                const data = a([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                ]);
                expect(writer.getData()).toEqual(data);
            }
        });

        test('if the data is not multiple of 3, writes correctly', () => {
            for (let i = 0; i < 4; i++) {
                const writer = useLayeredWriter(13);

                writer.writeLayer([1, 2, 3, 0], i);
                writer.writeLayer([4, 5, 7, 6], i);
                writer.writeLayer([7, 6, 8, 9], i);
                writer.writeLayer([13, 10, 11, 12], i);
                writer.writeLayer([13, null, null, 13], i);

                const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
                expect(writer.getData()).toEqual(data);
            }
        });
    });
});
