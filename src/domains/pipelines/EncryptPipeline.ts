import { awaitFiles, FileData, UploadedFile } from '../../utils/FileUtils';
import { encodeCipherData } from '../crypto/CipherDataEncoder';
import { encrypt } from '../crypto/Encrypter';
import { fetchTemplate, TemplateName } from '../template/TemplateManager';
import { encodeVaultData } from '../vault/VaultDataEncoder';

export interface EncryptPipeline {
    setTemplate(template: string): void;
    prefetch(): void;
    encrypt(files: UploadedFile[], password: string): Promise<FileData[]>;
}

interface EncryptPipelineDefinition {
    templateName: TemplateName;
    processVault(encryptedVault: ArrayBuffer, template: string): FileData[];
}

export function defineEncryptPipeline(
    def: EncryptPipelineDefinition,
): EncryptPipeline {
    let template: Promise<string> | undefined;

    return {
        setTemplate(value: string) {
            template = Promise.resolve(value);
        },

        prefetch() {
            template = fetchTemplate(def.templateName).catch((error) => {
                console.log('Failed to fetch template', error);
                return '';
            });
        },

        async encrypt(files, password) {
            const vault = {
                files: await awaitFiles(files),
            };
            const vaultBytes = encodeVaultData(vault);
            const cipherData = await encrypt(vaultBytes, password);

            const encryptedBytes = encodeCipherData(cipherData);
            if (!template) {
                throw new Error('Template not loaded');
            }
            return def.processVault(encryptedBytes, await template);
        },
    };
}
