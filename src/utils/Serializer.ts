import { bytesToBase64 } from '../converters/Base64Encoder';

export function serializeToJs(value: unknown): string {
    if (value === null || value === undefined || typeof value === 'number') {
        return String(value);
    }

    if (typeof value === 'string') {
        return `'${value}'`;
    }

    if (value instanceof Uint8Array) {
        const encoded = bytesToBase64(value);
        return `base64ToBytes('${encoded}')`;
    }

    if (typeof value === 'object') {
        const serialized = Object.entries(value).map(([key, value]) => {
            return `${key}: ${serializeToJs(value)}`;
        });
        return `{${serialized.join(', ')}}`;
    }

    throw new Error(`Unknown type: ${typeof value} (${value})`);
}
