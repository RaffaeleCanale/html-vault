import { base64ToBytes } from '../converters/Base64Encoder';
import { decryptVault } from '../converters/VaultEncrypter';
import type { EncryptedVault, VaultDataFile } from '../model/Vault';
import { formatBytes } from '../utils/FileUtils';

// eslint-disable-next-line
(window as any).base64ToBytes = base64ToBytes;
// eslint-disable-next-line
(window as any).decryptAndPopulateVault = decryptAndPopulateVault;

function useVaultViewerFilesList(
    filePreview: ReturnType<typeof useFilePreviewPage>,
) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vaultViewerListEl = document.getElementById('value-viewer-list')!;

    function createFileElement(file: VaultDataFile): HTMLElement {
        // eslint-disable-next-line
        const template = (window as any).FileCardTemplate as string;

        const downloadUrl = `data:${file.type};base64,${btoa(
            new TextDecoder().decode(file.fileData),
        )}`;
        const html = template
            .replaceAll('__NAME__', file.name)
            .replaceAll('0 Bytes', formatBytes(file.fileData.byteLength))
            .replaceAll('__DOWNLOAD_URL__', downloadUrl);

        const container = document.createElement('div');
        container.innerHTML = html;
        const result = container.firstElementChild as HTMLElement;
        result
            .getElementsByClassName('file-card__details')[0]
            ?.addEventListener('click', () => {
                console.log('CLICK!');
                filePreview.show(result, file);
            });
        return result;
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

function useFilePreviewPage() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const filePreviewPageEl = document.getElementById('file-preview-page')!;
    const filePreviewEl = document.getElementById('file-preview')!;

    filePreviewPageEl.addEventListener('click', () => {
        // filePreviewPageEl.setAttribute('style', 'display: none;');
        filePreviewPageEl.classList.add('shrink');
        setTimeout(() => {
            filePreviewPageEl.classList.remove('shrink');
            filePreviewPageEl.removeAttribute('style');
        }, 1000);
    });

    function render(file: VaultDataFile): HTMLElement {
        switch (file.type) {
            case 'text/plain':
                const div = document.createElement('div');
                div.innerText = new TextDecoder().decode(file.fileData);
                return div;
            default: {
                const div = document.createElement('div');
                div.innerText = 'Cannot render';
                return div;
            }
        }
    }

    return {
        show(fileEl: HTMLElement, file: VaultDataFile) {
            filePreviewPageEl.classList.remove('test');

            const rect = fileEl.getBoundingClientRect();

            const styles = [
                'display: flex',
                `left: ${rect.left}px`,
                `top: ${rect.top}px`,
                `width: ${rect.width}px`,
                `height: ${rect.height}px`,
            ].join(';');
            filePreviewPageEl.setAttribute('style', styles);

            filePreviewEl.innerHTML = '';
            filePreviewEl.appendChild(render(file));
            // filePreviewPageEl.classList.add('--dialog');
            // const styles2 = [
            //     'display: flex',
            //     `left: 0px`,
            //     `top: 0px`,
            //     `width: 100%`,
            //     `height: 100%`,
            // ].join(';');
            // filePreviewPageEl.setAttribute('style', styles2);
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

    const filePreview = {
        page: useFilePreviewPage(),
    };

    const vaultViewer = {
        page: useVaultViewerPage(),
        list: useVaultViewerFilesList(filePreview.page),
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
