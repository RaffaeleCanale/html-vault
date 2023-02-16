import { useDataReader, useDataWriter } from '../buffer/DataReader';
import type { FilePart } from './FilePart';
import { useLayeredReader, useLayeredWriter } from './LayeredReader';
import { Raid5 } from './SplitFileUtils';

export function splitFile(input: ArrayBuffer): FilePart[] {
    const reader = useLayeredReader(input);

    const parts = Raid5.getPartsSizes(input.byteLength).map(useDataWriter);

    while (reader.hasMore()) {
        const layer = reader.readLayer();

        layer.forEach((value, index) => {
            if (value !== null) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                parts[index]!.write(value);
            }
        });
    }

    return parts.map((part, index) => ({
        data: part.getData(),
        index,
        size: input.byteLength,
    }));
}

function getMissingIndex(parts: FilePart[]): number {
    const indexes = new Set([0, 1, 2, 3]);
    parts.forEach((part) => indexes.delete(part.index));
    return indexes.values().next().value as number;
}

export function joinFile(parts: FilePart[]): ArrayBuffer {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const writer = useLayeredWriter(parts[0]!.size);

    const missingIndex = getMissingIndex(parts);

    const partsReaders = parts.map((part) => ({
        reader: useDataReader(part.data),
        index: part.index,
    }));

    while (partsReaders.some(({ reader }) => reader.hasMore())) {
        const data = Array(4).fill(null) as (number | null)[];

        partsReaders.forEach(({ reader, index }) => {
            data[index] = reader.read();
        });

        writer.writeLayer(data, missingIndex);
    }

    return writer.getData();
}
