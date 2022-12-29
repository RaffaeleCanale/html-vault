import type { CipherData } from './CipherData';

export interface EncryptedVault {
    data: CipherData;
}

export interface VaultDataFile {
    name: string;
    type: string;
    fileData: ArrayBuffer;
}

export interface Vault {
    files: VaultDataFile[];
}
