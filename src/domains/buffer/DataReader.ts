export function useDataReader(input: ArrayBuffer) {
    const view = new DataView(input);

    let cursor = 0;

    return {
        hasMore() {
            return cursor < view.byteLength;
        },

        read(): number | null {
            if (!this.hasMore()) {
                return null;
            }
            const value = view.getUint8(cursor);
            cursor += 1;
            return value;
        },

        readUint16(): number | null {
            if (!this.hasMore()) {
                return null;
            }
            const value = view.getUint16(cursor);
            cursor += 2;
            return value;
        },

        readUint32(): number | null {
            if (!this.hasMore()) {
                return null;
            }
            const value = view.getUint32(cursor);
            cursor += 4;
            return value;
        },

        readAll(size?: number): ArrayBuffer {
            const length = size ?? view.byteLength - cursor;
            const result = input.slice(cursor, cursor + length);
            cursor += length;
            return result;
        },
    };
}

export function useDataWriter(size: number) {
    const data = new Uint8Array(size);
    const view = new DataView(data.buffer);

    let cursor = 0;

    return {
        write(value: number) {
            view.setUint8(cursor, value);
            cursor += 1;
        },

        writeUint16(value: number) {
            view.setUint16(cursor, value);
            cursor += 2;
        },

        writeUint32(value: number) {
            view.setUint32(cursor, value);
            cursor += 4;
        },

        writeAll(values: ArrayBuffer) {
            data.set(new Uint8Array(values), cursor);
            cursor += values.byteLength;
        },

        getData(): ArrayBuffer {
            return data.buffer;
        },

        hasMore(): boolean {
            return cursor < size;
        },
    };
}
