import { describe, expect, test } from 'vitest';
import { Raid5 } from './SplitFileUtils';

describe('SplitFileUtils', () => {
    describe('#getParityIndexForLayer', () => {
        test('returns the correct parity index for the layer', () => {
            expect(Raid5.getParityIndexForLayer(0)).toBe(3);
            expect(Raid5.getParityIndexForLayer(1)).toBe(2);
            expect(Raid5.getParityIndexForLayer(2)).toBe(1);
            expect(Raid5.getParityIndexForLayer(3)).toBe(0);
            expect(Raid5.getParityIndexForLayer(4)).toBe(3);
            expect(Raid5.getParityIndexForLayer(5)).toBe(2);
            expect(Raid5.getParityIndexForLayer(6)).toBe(1);
            expect(Raid5.getParityIndexForLayer(7)).toBe(0);
        });
    });

    describe('#getPartsSizes', () => {
        test('computes the correct part sizes', () => {
            expect(Raid5.getPartsSizes(0)).toEqual([0, 0, 0, 0]);
            expect(Raid5.getPartsSizes(6)).toEqual([2, 2, 2, 2]);
            expect(Raid5.getPartsSizes(7)).toEqual([3, 3, 2, 2]);
            expect(Raid5.getPartsSizes(13)).toEqual([5, 4, 4, 5]);
            expect(Raid5.getPartsSizes(14)).toEqual([5, 5, 4, 5]);
        });
    });
});
