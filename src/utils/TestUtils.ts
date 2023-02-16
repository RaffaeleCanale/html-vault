import crypto from 'crypto';
import { expect } from 'vitest';

export function a(bytes: number[]): ArrayBuffer {
    return new Uint8Array(bytes).buffer;
}

Object.defineProperty(globalThis, 'window', {
    value: { crypto },
});

expect.extend({
    toEqual(received, expected) {
        received = transformArrayBuffers(received);
        expected = transformArrayBuffers(expected);

        // Duplicated from jest.
        // https://github.com/facebook/jest/blob/f3dab7/packages/expect/src/matchers.ts#L538-L569
        /* eslint-disable */
        const pass = this.equals(received, expected, [
            this.utils.iterableEquality,
        ]);

        const matcherName = 'toEqual';
        const options = {
            comment: 'deep equality',
            isNot: this.isNot,
            promise: this.promise,
        };
        const message = pass
            ? () =>
                  this.utils.matcherHint(
                      matcherName,
                      undefined,
                      undefined,
                      options,
                  ) +
                  '\n\n' +
                  `Expected: ${this.utils.printExpected(expected)}\n` +
                  `Received: ${this.utils.printReceived(received)}`
            : () => {
                  const difference = this.utils.diff(expected, received, {
                      expand: this.expand ?? true,
                  });

                  return (
                      this.utils.matcherHint(
                          matcherName,
                          undefined,
                          undefined,
                          options,
                      ) +
                      '\n\n' +
                      (difference && difference.includes('- Expect')
                          ? `Difference:\n\n${difference}`
                          : `Expected: ${this.utils.printExpected(
                                expected,
                            )}\n` +
                            `Received: ${this.utils.printReceived(received)}`)
                  );
              };

        return {
            actual: received,
            expected,
            message,
            name: matcherName,
            pass,
        };
    },
});

function transformArrayBuffers(obj: unknown): unknown {
    if (obj instanceof ArrayBuffer) {
        return new Uint8Array(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(transformArrayBuffers);
    }

    if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key of Object.keys(obj)) {
            result[key] = transformArrayBuffers(obj[key]);
        }
        return result;
    }

    return obj;
}
