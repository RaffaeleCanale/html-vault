import type { FileData } from '../../utils/FileUtils';
import { decodeCipherData } from '../crypto/CipherDataEncoder';
import { decrypt } from '../crypto/Encrypter';
import { decodeVaultData } from '../vault/VaultDataEncoder';

export interface DecryptPipeline<I> {
    decrypt(input: I, password: string): Promise<FileData[]>;
}

interface DecryptPipelineDefinition<I> {
    inputToCipher(input: I): Promise<ArrayBuffer>;
}
export function defineDecryptPipeline<I>(
    def: DecryptPipelineDefinition<I>,
): DecryptPipeline<I> {
    return {
        async decrypt(input, password) {
            const encryptedBytes = await def.inputToCipher(input);

            const cipherData = decodeCipherData(encryptedBytes);
            const vaultBytes = await decrypt(cipherData, password);

            const vault = decodeVaultData(vaultBytes);
            return vault.files;
        },
    };
}
