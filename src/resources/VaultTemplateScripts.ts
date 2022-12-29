import { base64ToBytes } from '../converters/Base64Encoder';
import { decryptVault } from '../converters/VaultEncrypter';
import type { EncryptedVault, VaultDataFile } from '../model/Vault';
import { formatBytes } from '../utils/FileUtils';

// eslint-disable-next-line
(window as any).base64ToBytes = base64ToBytes;
// eslint-disable-next-line
(window as any).decryptAndPopulateVault = decryptAndPopulateVault;

function useVaultViewerFilesList() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vaultViewerListEl = document.getElementById('value-viewer-list')!;

    function createFileElement(file: VaultDataFile): HTMLElement {
        // eslint-disable-next-line
        const template = (window as any).FileCardTemplate as string;

        const html = template
            .replace('__NAME__', file.name)
            .replace('0 Bytes', formatBytes(file.fileData.byteLength));
        const a = document.createElement('a');
        a.innerHTML = html;

        return a;
    }

    return {
        addFile(file: VaultDataFile, index: number) {
            const el = createFileElement(file);
            el.setAttribute(
                'style',
                `animation-delay: ${500 + index * 100}ms;`,
            );
            vaultViewerListEl.appendChild(el);
        },
    };
}

function useErrorHint() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const errorEl = document.getElementById('error')!;

    return {
        show() {
            errorEl.removeAttribute('hidden');
        },
        hide() {
            errorEl.setAttribute('hidden', 'true');
        },
    };
}

function usePasswordInput() {
    const passwordEl = document.getElementById('password') as HTMLInputElement;

    return {
        clearError() {
            passwordEl.classList.remove('error');
        },
        setError() {
            passwordEl.classList.add('error');
        },
        value() {
            return passwordEl.value;
        },
    };
}

function useLoadingPage() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const spinnerPageEl = document.getElementById('spinner-page')!;

    return {
        enterDown() {
            spinnerPageEl.classList.add('--enter-down');
        },
        exitUp() {
            spinnerPageEl.classList.remove('--enter-down');
            spinnerPageEl.classList.add('--exit-up');
            setTimeout(() => {
                spinnerPageEl.remove();
            }, 600);
        },
        exitDown() {
            spinnerPageEl.classList.remove('--enter-down');
            spinnerPageEl.classList.add('--exit-down');
            setTimeout(() => {
                spinnerPageEl.classList.remove('--exit-down');
            }, 600);
        },
    };
}

function useVaultFormPage() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vaultFormPageEl = document.getElementById('vault-form-page')!;

    return {
        exitUp() {
            vaultFormPageEl.classList.add('--exit-up');
        },
        remove() {
            vaultFormPageEl.remove();
        },
        enterUp() {
            vaultFormPageEl.classList.remove('--exit-up');
            vaultFormPageEl.classList.add('--enter-up');
        },
    };
}

function useVaultViewerPage() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const viewerPageEl = document.getElementById('vault-viewer-page')!;

    return {
        enterDown() {
            viewerPageEl.classList.add('--enter-down');
        },
    };
}

async function decryptAndPopulateVault(vault: EncryptedVault): Promise<void> {
    const vaultForm = {
        page: useVaultFormPage(),
        errorHint: useErrorHint(),
        passwordInput: usePasswordInput(),
    };

    const loading = {
        page: useLoadingPage(),
    };

    const vaultViewer = {
        page: useVaultViewerPage(),
        list: useVaultViewerFilesList(),
    };

    vaultForm.page.exitUp();
    vaultForm.errorHint.hide();
    vaultForm.passwordInput.clearError();

    loading.page.enterDown();

    try {
        const result = await Promise.allSettled([
            decryptVault(vault, vaultForm.passwordInput.value()),
            // Minimal wait time
            new Promise((resolve) => setTimeout(resolve, 900)),
        ]);
        if (result[0].status === 'rejected') {
            throw result[0].reason;
        }
        const { files } = result[0].value;

        // eslint-disable-next-line @typescript-eslint/unbound-method
        files.forEach(vaultViewer.list.addFile);

        vaultViewer.page.enterDown();
        loading.page.exitUp();
        vaultForm.page.remove();
    } catch (error) {
        vaultForm.errorHint.show();
        vaultForm.passwordInput.setError();

        loading.page.exitDown();

        vaultForm.page.enterUp();

        if (error instanceof DOMException) {
            console.error(error.name, error);
        } else {
            console.error(error);
        }
    }
}
