import type { KeyOptions } from '../utils/KeyUtils';

export interface CipherData {
    encryptedData: Uint8Array;
    keyOptions: KeyOptions;
    iv: Uint8Array;
}
