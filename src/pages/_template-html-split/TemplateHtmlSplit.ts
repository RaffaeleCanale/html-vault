import { HtmlSplitDecrypt } from '../../domains/pipelines/HtmlSplitPipeline';
import { debounced } from '../../utils/Debounce';
import { useLoadingPage } from '../_template-html-single/pages/LoadingPage';
import { useVaultViewerPage } from '../_template-html-single/pages/VaultViewerPage';
import { useSplitVaultFormPage } from './pages/SplitVaultFormPage';

const formPage = useSplitVaultFormPage();
const loadingPage = useLoadingPage();
const viewerPage = useVaultViewerPage();

async function decryptAndPopulateVault(): Promise<void> {
    formPage.onDecryptStart();
    loadingPage.onDecryptStart();

    try {
        const files = await debounced(
            HtmlSplitDecrypt.decrypt(
                {
                    selfPart: window.vaultPart,
                    otherParts: formPage.getFiles(),
                },
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
