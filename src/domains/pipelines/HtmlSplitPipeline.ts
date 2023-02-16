import type { UploadedFile } from '../../utils/FileUtils';
import { base64ToBytes, bytesToBase64 } from '../buffer/Base64Encoder';
import { decodeFilePart, encodeFilePart } from '../raid/FilePartEncoder';
import { joinFile, splitFile } from '../raid/FileSplitter';
import { defineDecryptPipeline } from './DecryptPipeline';
import { defineEncryptPipeline } from './EncryptPipeline';

export const HtmlSplitEncrypt = /* @__PURE__ */ defineEncryptPipeline({
    templateName: 'html-split',
    processVault(encryptedVault, template) {
        const split = splitFile(encryptedVault);
        return split.map((part, i) => {
            const placeholder = bytesToBase64(encodeFilePart(part));
            const file = template.replace('__VAULT_PLACEHOLDER__', placeholder);

            return {
                data: new TextEncoder().encode(file).buffer,
                name: `vault-part-${i + 1}.html`,
                type: 'text/html',
            };
        });
    },
});

interface SplitInput {
    selfPart: string;
    otherParts: UploadedFile[];
}
export const HtmlSplitDecrypt =
    /* @__PURE__ */ defineDecryptPipeline<SplitInput>({
        async inputToCipher({ selfPart, otherParts }) {
            console.log(
                '...(await Promise.all(otherParts.map(parsePartContent)))',
                ...(await Promise.all(otherParts.map(parsePartContent))),
            );
            const parts = [
                selfPart,
                ...(await Promise.all(otherParts.map(parsePartContent))),
            ].map((part) => decodeFilePart(base64ToBytes(part)));

            return joinFile(parts);
        },
    });

export async function parsePartContent(file: UploadedFile): Promise<string> {
    const fileContent = new TextDecoder().decode(await file.data);

    const regex = /window.vaultPart = '([^']+)';/g;

    const match = regex.exec(fileContent);
    console.log('fileContent', fileContent);
    console.log('match', match);
    if (!match) {
        throw new Error('Failed to parse vault');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return match[1]!;
}
