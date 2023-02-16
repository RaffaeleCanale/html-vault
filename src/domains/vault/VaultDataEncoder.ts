import type { FileData } from '../../utils/FileUtils';
import { useDataReader, useDataWriter } from '../buffer/DataReader';
import type { Vault } from './Vault';

interface EncodedVaultDataFile {
    name: ArrayBuffer;
    type: ArrayBuffer;
    data: ArrayBuffer;
}

function encodeFiles(files: FileData[]): EncodedVaultDataFile[] {
    return files.map((file) => {
        const name = new TextEncoder().encode(file.name).buffer;
        const type = new TextEncoder().encode(file.type).buffer;

        return {
            name,
            type,
            data: file.data,
        };
    });
}

function decodeFiles(files: EncodedVaultDataFile[]): FileData[] {
    return files.map((file) => {
        const name = new TextDecoder().decode(file.name);
        const type = new TextDecoder().decode(file.type);

        return {
            name,
            type,
            data: file.data,
        };
    });
}

export function encodeVaultData(data: Vault): ArrayBuffer {
    /*
        + 2 // name
        + 2 // type
        + 4 // fileData
        = 8
     */
    const files = encodeFiles(data.files);

    const totalLength = files.reduce(
        (acc, file) =>
            acc +
            8 +
            file.name.byteLength +
            file.type.byteLength +
            file.data.byteLength,
        0,
    );

    const writer = useDataWriter(totalLength);

    files.forEach((file) => {
        writer.writeUint16(file.name.byteLength);
        writer.writeAll(file.name);

        writer.writeUint16(file.type.byteLength);
        writer.writeAll(file.type);

        writer.writeUint32(file.data.byteLength);
        writer.writeAll(file.data);
    });

    return writer.getData();
}

export function decodeVaultData(buffer: ArrayBuffer): Vault {
    const reader = useDataReader(buffer);
    const files: EncodedVaultDataFile[] = [];

    while (reader.hasMore()) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nameLength = reader.readUint16()!;
        const name = reader.readAll(nameLength);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const typeLength = reader.readUint16()!;
        const type = reader.readAll(typeLength);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const fileDataLength = reader.readUint32()!;
        const data = reader.readAll(fileDataLength);

        files.push({ name, type, data });
    }

    return {
        files: decodeFiles(files),
    };
}
