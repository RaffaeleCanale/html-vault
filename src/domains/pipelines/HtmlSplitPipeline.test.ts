/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, test } from 'vitest';
import type { FileData, UploadedFile } from '../../utils/FileUtils';
import '../../utils/TestUtils';
import {
    HtmlSplitDecrypt,
    HtmlSplitEncrypt,
    parsePartContent,
} from './HtmlSplitPipeline';

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

describe('HtmlSplitPipeline', () => {
    async function encrypt(
        files: FileData[],
        password: string,
    ): Promise<FileData[]> {
        HtmlSplitEncrypt.setTemplate(
            "window.vaultPart = '__VAULT_PLACEHOLDER__';",
        );
        const encrypted = await HtmlSplitEncrypt.encrypt(
            files.map(toUploadedFile),
            password,
        );
        expect(encrypted).toHaveLength(4);

        return encrypted;
    }

    async function decrypt(
        input: { selfPart: FileData; otherParts: FileData[] },
        password: string,
    ): Promise<FileData[]> {
        const selfPart = await parsePartContent(toUploadedFile(input.selfPart));
        return HtmlSplitDecrypt.decrypt(
            {
                selfPart,
                otherParts: input.otherParts.map(toUploadedFile),
            },
            password,
        );
    }

    test('encrypting and decrypting regular case works', async () => {
        // GIVEN some files
        const files = getTestFiles();

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(
            {
                selfPart: encrypted[0]!,
                otherParts: [encrypted[1]!, encrypted[2]!],
            },
            'password',
        );

        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting works in any order', async () => {
        // GIVEN some files
        const files = getTestFiles();
        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(
            {
                selfPart: encrypted[3]!,
                otherParts: [encrypted[1]!, encrypted[0]!],
            },
            'password',
        );
        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting works with all files', async () => {
        // GIVEN some files
        const files = getTestFiles();
        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(
            {
                selfPart: encrypted[0]!,
                otherParts: [encrypted[1]!, encrypted[2]!, encrypted[3]!],
            },
            'password',
        );
        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting works with duplicates', async () => {
        // GIVEN some files
        const files = getTestFiles();
        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(
            {
                selfPart: encrypted[0]!,
                otherParts: [encrypted[1]!, encrypted[2]!, encrypted[1]!],
            },
            'password',
        );
        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting fails with not enough parts', async () => {
        // GIVEN some files
        const files = getTestFiles();
        // WHEN encrypting and decrypting the files with not enough parts
        const encrypted = await encrypt(files, 'password');

        // THEN the decryption fails
        await expect(
            decrypt(
                {
                    selfPart: encrypted[0]!,
                    otherParts: [encrypted[1]!],
                },
                'wrong password',
            ),
        ).rejects.toThrow();
    });

    test('encrypting and decrypting fails with not enough distinct parts', async () => {
        // GIVEN some files
        const files = getTestFiles();
        // WHEN encrypting and decrypting the files with not enough distinct parts
        const encrypted = await encrypt(files, 'password');

        // THEN the decryption fails
        await expect(
            decrypt(
                {
                    selfPart: encrypted[0]!,
                    otherParts: [encrypted[1]!, encrypted[1]!],
                },
                'wrong password',
            ),
        ).rejects.toThrow();
    });

    test('encrypting and decrypting for empty files works', async () => {
        // GIVEN some files
        const files: FileData[] = [];

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        const result = await decrypt(
            {
                selfPart: encrypted[0]!,
                otherParts: [encrypted[1]!, encrypted[2]!],
            },
            'password',
        );

        // THEN the decrypted files should match the original files
        expect(result).toEqual(files);
    });

    test('encrypting and decrypting with wrong password fails', async () => {
        // GIVEN some files
        const files = getTestFiles();

        // WHEN encrypting and decrypting the files
        const encrypted = await encrypt(files, 'password');
        await expect(
            decrypt(
                {
                    selfPart: encrypted[0]!,
                    otherParts: [encrypted[1]!, encrypted[2]!],
                },
                'wrong password',
            ),
        ).rejects.toThrow();
    });
});
