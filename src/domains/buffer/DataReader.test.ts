import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import { useDataReader, useDataWriter } from './DataReader';

describe('DataReader', () => {
    describe('#useDataReader', () => {
        test('if the data is empty, returns empty', () => {
            const data = a([]);

            const reader = useDataReader(data);

            expect(reader.hasMore()).toBe(false);
        });

        test('data is read correctly', () => {
            const data = a([1, 2, 3, 4, 5]);

            const reader = useDataReader(data);

            expect(reader.hasMore()).toBe(true);
            expect(reader.read()).toBe(1);

            expect(reader.hasMore()).toBe(true);
            expect(reader.read()).toBe(2);

            expect(reader.hasMore()).toBe(true);
            expect(reader.read()).toBe(3);

            expect(reader.hasMore()).toBe(true);
            expect(reader.read()).toBe(4);

            expect(reader.hasMore()).toBe(true);
            expect(reader.read()).toBe(5);

            expect(reader.hasMore()).toBe(false);
        });

        test('reading data beyond what is available returns null', () => {
            const data = a([1, 2, 3]);

            const reader = useDataReader(data);

            expect(reader.read()).toBe(1);
            expect(reader.read()).toBe(2);
            expect(reader.read()).toBe(3);

            expect(reader.hasMore()).toBe(false);
            expect(reader.read()).toBe(null);
            expect(reader.read()).toBe(null);
            expect(reader.hasMore()).toBe(false);
        });
    });

    describe('#useDataWriter', () => {
        test('data is written correctly', () => {
            const writer = useDataWriter(5);

            expect(writer.getData().byteLength).toEqual(5);

            writer.write(1);
            expect(writer.hasMore()).toBe(true);
            expect(writer.getData()).toEqual(a([1, 0, 0, 0, 0]));

            writer.write(2);
            expect(writer.hasMore()).toBe(true);
            expect(writer.getData()).toEqual(a([1, 2, 0, 0, 0]));

            writer.write(3);
            expect(writer.hasMore()).toBe(true);
            expect(writer.getData()).toEqual(a([1, 2, 3, 0, 0]));

            writer.write(4);
            expect(writer.hasMore()).toBe(true);
            expect(writer.getData()).toEqual(a([1, 2, 3, 4, 0]));

            writer.write(5);
            expect(writer.hasMore()).toBe(false);
            expect(writer.getData()).toEqual(a([1, 2, 3, 4, 5]));
        });

        test('writing data beyond what is available throws an exception', () => {
            const writer = useDataWriter(3);

            writer.write(1);
            writer.write(2);
            writer.write(3);

            expect(writer.hasMore()).toBe(false);

            expect(() => writer.write(4)).toThrow();
        });
    });
});
