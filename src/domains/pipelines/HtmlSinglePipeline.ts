import { base64ToBytes, bytesToBase64 } from '../buffer/Base64Encoder';
import { defineDecryptPipeline } from './DecryptPipeline';
import { defineEncryptPipeline } from './EncryptPipeline';

export const HtmlSingleEncrypt = /* @__PURE__ */ defineEncryptPipeline({
    templateName: 'html-single',
    processVault(encryptedVault, template) {
        const file = template.replace(
            '__VAULT_PLACEHOLDER__',
            bytesToBase64(encryptedVault),
        );

        return [
            {
                data: new TextEncoder().encode(file).buffer,
                name: 'vault.html',
                type: 'text/html',
            },
        ];
    },
});

export const HtmlSingleDecrypt = /* @__PURE__ */ defineDecryptPipeline<string>({
    inputToCipher(input) {
        return Promise.resolve(base64ToBytes(input));
    },
});
