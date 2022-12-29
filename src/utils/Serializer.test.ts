import { describe, expect, test } from 'vitest';
import { serializeToJs } from './Serializer';

describe('serializeToJs', () => {
    test('correctly serializes an empty object', () => {
        expect(serializeToJs({})).toBe('{}');
    });

    test('correctly serializes an empty with strings and numbers', () => {
        expect(serializeToJs({ a: 1, b: '2' })).toBe("{a: 1, b: '2'}");
    });

    test('correctly serializes an empty with null or undefined', () => {
        expect(serializeToJs({ a: null, b: undefined })).toBe(
            '{a: null, b: undefined}',
        );
    });

    test('correctly serializes a nested object', () => {
        expect(serializeToJs({ a: { b: 1 } })).toBe('{a: {b: 1}}');
    });

    test('correctly serializes a Uint8Array', () => {
        expect(serializeToJs({ a: new Uint8Array([1, 2, 3]) })).toBe(
            "{a: base64ToBytes('AQID')}",
        );
    });
});
