import { describe, expect, test } from 'vitest';
import type { FileData, UploadedFile } from '../../utils/FileUtils';
import '../../utils/TestUtils';
import { HtmlSingleDecrypt, HtmlSingleEncrypt } from './HtmlSinglePipeline';

function toUploadedFile(file: FileData): UploadedFile {
    return {
        name: file.name,
        type: file.type,
        data: Promise.resolve(file.data),
    };
}

function getTestFiles(): FileData[] {
    return [
        {
            name: 'test.txt',
            type: 'text/plain',
            data: new TextEncoder().encode('Hello World!').buffer,
        },
        {
            name: 'test2.txt',
            type: 'text/plain',
            data: new TextEncoder().encode('Foobar!').buffer,
        },
    ];
}

describe('HtmlSinglePipeline', () => {
    async function encrypt(
        files: FileData[],
        password: string,
    ): Promise<FileData[]> {
        HtmlSingleEncrypt.setTemplate('__VAULT_PLACEHOLDER__');
        const encrypted = await HtmlSingleEncrypt.encrypt(
            files.map(toUploadedFile),
            password,
        );
        expect(encrypted).toHaveLength(1);

        return encrypted;
    }

    function decrypt(
        encryptedFiles: FileData[],
        password: string,
    ): Promise<FileData[]> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const vault = new TextDecoder().decode(encryptedFiles[0]!.data);
        return HtmlSingleDecrypt.decrypt(vault, password);
    }

    test('encrypting and decrypting works', async () => {
        // GIVEN some files
        const files = getTestFiles();

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(encrypted, 'password');

        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting for empty files works', async () => {
        // GIVEN some files
        const files: FileData[] = [];

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(encrypted, 'password');

        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting with wrong password fails', async () => {
        // GIVEN some files
        const files = getTestFiles();

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        await expect(decrypt(encrypted, 'wrong password')).rejects.toThrow();
    });
});
