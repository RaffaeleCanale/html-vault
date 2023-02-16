import { describe, expect, test } from 'vitest';
import { a } from '../../utils/TestUtils';
import type { FilePart } from './FilePart';
import { joinFile, splitFile } from './FileSplitter';

function expectSplit(split: FilePart[], parts: ArrayBuffer[]) {
    expect(split).toHaveLength(parts.length);

    parts.forEach((part, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(split[index]!.data).toEqual(part);
    });
}

function testWithAllPartsCombinations(
    parts: FilePart[],
    fn: (parts: FilePart[]) => void,
): void {
    for (let i = 0; i < 3; i += 1) {
        const partsPartial = [...parts];
        partsPartial.splice(i, 1);
        fn(partsPartial);
    }
}

describe('FileSplitter', () => {
    describe('#splitFile', () => {
        test('if the data is empty, returns empty', () => {
            const data = a([]);

            const split = splitFile(data);

            expectSplit(split, [a([]), a([]), a([]), a([])]);
        });

        test('if the data is multiple of 3, correctly splits the data', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

            const split = splitFile(data);

            expectSplit(split, [
                a([1, 4, 7, 13, 13]),
                a([2, 5, 6, 10, 14]),
                a([3, 7, 8, 11, 15]),
                a([0, 6, 9, 12, 12]),
            ]);
        });

        test('if the data is not multiple of 3, correctly splits the data', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

            const split = splitFile(data);

            expectSplit(split, [
                a([1, 4, 7, 13, 13]),
                a([2, 5, 6, 10]),
                a([3, 7, 8, 11]),
                a([0, 6, 9, 12, 13]),
            ]);
        });
    });

    describe('#joinFile', () => {
        test('if the data is empty, returns empty', () => {
            const parts: FilePart[] = [
                {
                    data: a([]),
                    index: 0,
                    size: 0,
                },
                {
                    data: a([]),
                    index: 0,
                    size: 0,
                },
                {
                    data: a([]),
                    index: 0,
                    size: 0,
                },
            ];

            const join = joinFile(parts);

            expect(join).toEqual(a([]));
        });

        test('if the data is multiple of 3, correctly joins the data', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
            const allParts: FilePart[] = [
                {
                    data: a([1, 4, 7, 13, 13]),
                    index: 0,
                    size: 15,
                },
                {
                    data: a([2, 5, 6, 10, 14]),
                    index: 1,
                    size: 15,
                },
                {
                    data: a([3, 7, 8, 11, 15]),
                    index: 2,
                    size: 15,
                },
                {
                    data: a([0, 6, 9, 12, 12]),
                    index: 3,
                    size: 15,
                },
            ];

            testWithAllPartsCombinations(allParts, (parts) => {
                const join = joinFile(parts);

                expect(join).toEqual(data);
            });
        });

        test('if the data is not multiple of 3, correctly joins the data', () => {
            const data = a([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
            const allParts: FilePart[] = [
                {
                    data: a([1, 4, 7, 13, 13]),
                    index: 0,
                    size: 13,
                },
                {
                    data: a([2, 5, 6, 10]),
                    index: 1,
                    size: 13,
                },
                {
                    data: a([3, 7, 8, 11]),
                    index: 2,
                    size: 13,
                },
                {
                    data: a([0, 6, 9, 12, 13]),
                    index: 3,
                    size: 13,
                },
            ];

            testWithAllPartsCombinations(allParts, (parts) => {
                const join = joinFile(parts);

                expect(join).toEqual(data);
            });
        });
    });

    describe('split and join', () => {
        function testSplitAndJoin(data: ArrayBuffer) {
            const allParts = splitFile(data);
            testWithAllPartsCombinations(allParts, (parts) => {
                const join = joinFile(parts);

                expect(join).toEqual(data);
            });
        }

        test('table test', () => {
            const data = [
                a([]),
                a([1]),
                a([1, 2, 3, 4, 5, 6, 7]),
                a([1, 2, 3, 4, 5, 65, 7, 8, 98, 36, 2345, 2345]),
                new TextEncoder().encode('Hello World!').buffer,
                new TextEncoder().encode(
                    'String with special characters: ąęćżźńłóśĄĘĆŻŹŃŁÓŚ',
                ).buffer,
                new TextEncoder().encode('Very long string!!!! '.repeat(100000))
                    .buffer,
            ];

            data.forEach(testSplitAndJoin);
        });
    });
});
