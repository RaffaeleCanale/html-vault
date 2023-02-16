import { useDataReader, useDataWriter } from '../buffer/DataReader';
import type { FilePart } from './FilePart';

export function encodeFilePart(part: FilePart): ArrayBuffer {
    const writer = useDataWriter(part.data.byteLength + 8);

    writer.writeUint32(part.index);
    writer.writeUint32(part.size);
    writer.writeAll(part.data);

    return writer.getData();
}

export function decodeFilePart(part: ArrayBuffer): FilePart {
    const reader = useDataReader(part);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = reader.readUint32()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const size = reader.readUint32()!;
    const data = reader.readAll();

    return {
        data,
        index,
        size,
    };
}
