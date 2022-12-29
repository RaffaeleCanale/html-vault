import type { Vault, VaultDataFile } from '../model/Vault';

export function encodeVaultData(data: Vault): ArrayBuffer {
    function encodeFile(file: VaultDataFile): Uint8Array {
        const metadata = new TextEncoder().encode(`${file.name}//${file.type}`);

        const result = new Uint8Array(
            6 + metadata.length + file.fileData.byteLength,
        );
        const view = new DataView(result.buffer);

        view.setUint16(0, metadata.length);
        result.set(metadata, 2);
        view.setUint32(2 + metadata.length, file.fileData.byteLength);
        result.set(new Uint8Array(file.fileData), 6 + metadata.length);

        return result;
    }

    const files = data.files.map(encodeFile);
    const totalLength = files.reduce((acc, file) => acc + file.length, 0);
    const result = new Uint8Array(totalLength);
    files.reduce((offset, file) => {
        result.set(file, offset);
        return offset + file.length;
    }, 0);

    return result.buffer;
}

export function decodeVaultData(buffer: ArrayBuffer): Vault {
    const data = new DataView(buffer);
    let offset = 0;

    function decodeFile(): VaultDataFile {
        const metadataLength = data.getUint16(offset);
        offset += 2;

        const metadata = new TextDecoder().decode(
            data.buffer.slice(offset, offset + metadataLength),
        );
        offset += metadataLength;

        const fileDataLength = data.getUint32(offset);
        offset += 4;

        const fileData = data.buffer.slice(offset, offset + fileDataLength);
        offset += fileDataLength;

        const [name, type] = metadata.split('//');

        if (name === undefined || type === undefined) {
            throw new Error('invalid metadata');
        }

        return {
            name,
            type,
            fileData,
        };
    }

    const files: VaultDataFile[] = [];
    while (offset < data.buffer.byteLength) {
        files.push(decodeFile());
    }

    return { files };
}
