import { HtmlSingleDecrypt } from '../../domains/pipelines/HtmlSinglePipeline';
import { debounced } from '../../utils/Debounce';
import { useLoadingPage } from './pages/LoadingPage';
import { useVaultFormPage } from './pages/VaultFormPage';
import { useVaultViewerPage } from './pages/VaultViewerPage';

const formPage = useVaultFormPage();
const loadingPage = useLoadingPage();
const viewerPage = useVaultViewerPage();

async function decryptAndPopulateVault(): Promise<void> {
    formPage.onDecryptStart();
    loadingPage.onDecryptStart();

    try {
        const files = await debounced(
            HtmlSingleDecrypt.decrypt(
                window.vaultSingle,
                formPage.getPassword(),
            ),
            900,
        );

        // eslint-disable-next-line @typescript-eslint/unbound-method
        files.forEach(viewerPage.addFile);

        formPage.onDecryptSuccess();
        loadingPage.onDecryptSuccess();
        viewerPage.onDecryptSuccess();
    } catch (error) {
        formPage.onDecryptError();
        loadingPage.onDecryptError();

        if (error instanceof DOMException) {
            console.error(error.name, error);
        } else {
            console.error(error);
        }
    }
}

formPage.onSubmit(() => void decryptAndPopulateVault());
