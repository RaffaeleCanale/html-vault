import type { EncryptedVault, Vault } from '../model/Vault';
import { decrypt, encrypt } from './Encrypter';
import { decodeVaultData, encodeVaultData } from './VaultDataEncoder';

export async function encryptVault(
    data: Vault,
    password: string,
): Promise<EncryptedVault> {
    const dataBytes = encodeVaultData(data);

    const encrypted = await encrypt(dataBytes, password);

    return {
        data: encrypted,
    };
}

export async function decryptVault(
    vault: EncryptedVault,
    password: string,
): Promise<Vault> {
    const data = await decrypt(vault.data, password);

    return decodeVaultData(data);
}
