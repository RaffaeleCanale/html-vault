import { describe, expect, test } from 'vitest';
import { formatBytes } from './FileUtils';

describe('FileUtils', () => {
    describe('#formatBytes', () => {
        test('0 bytes are properly formatted', () => {
            expect(formatBytes(0)).toBe('0 Bytes');
        });

        test('Kilobytes are properly formatted', () => {
            expect(formatBytes(1000)).toBe('1000 Bytes');
            expect(formatBytes(1024)).toBe('1 KB');
        });

        test('Megabytes are properly formatted', () => {
            expect(formatBytes(1024 * 1024)).toBe('1 MB');
        });

        test('Gigabytes is the highest unit', () => {
            expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
            expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1024 GB');
        });
    });
});
