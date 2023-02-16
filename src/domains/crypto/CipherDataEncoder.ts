import { useDataReader, useDataWriter } from '../buffer/DataReader';
import type { CipherData } from './CipherData';

const MAX_UINT_16 = 1 << 16;

export function encodeCipherData(data: CipherData): ArrayBuffer {
    /*
        + 2 // block length
        + 2 // salt length
        + 4 // iterations
        + 4 // key length
        = 12
     */
    if (data.options.blockSize > MAX_UINT_16) {
        throw new Error('Block size is too large');
    }
    if (data.options.saltSize > MAX_UINT_16) {
        throw new Error('Salt size is too large');
    }
    if (data.options.blockSize !== data.iv.byteLength) {
        throw new Error('Block size does not match IV size');
    }
    if (data.options.saltSize !== data.salt.byteLength) {
        throw new Error('Salt size does not match salt size');
    }

    const totalLength =
        data.salt.byteLength +
        data.iv.byteLength +
        data.encryptedData.byteLength +
        12;

    const writer = useDataWriter(totalLength);

    writer.writeUint16(data.options.blockSize);
    writer.writeUint16(data.options.saltSize);
    writer.writeUint32(data.options.iterations);
    writer.writeUint32(data.options.keySize);

    writer.writeAll(data.salt);
    writer.writeAll(data.iv);
    writer.writeAll(data.encryptedData);

    return writer.getData();
}

export function decodeCipherData(data: ArrayBuffer): CipherData {
    const reader = useDataReader(data);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const blockSize = reader.readUint16()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const saltSize = reader.readUint16()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iterations = reader.readUint32()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keySize = reader.readUint32()!;

    const salt = reader.readAll(saltSize);
    const iv = reader.readAll(blockSize);
    const encryptedData = reader.readAll();

    return {
        options: {
            blockSize,
            saltSize,
            iterations,
            keySize,
        },
        salt,
        iv,
        encryptedData,
    };
}
