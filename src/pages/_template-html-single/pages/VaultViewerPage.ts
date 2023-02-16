import { usePage } from '../../../components/layout/Page';
import { renderDownloadFileCard } from '../../../components/molecules/FileCard';
import type { FileData } from '../../../utils/FileUtils';
import { useFilePreviewDialog } from '../components/FilePreviewDialog';

export function useVaultViewerPage() {
    const preview = useFilePreviewDialog();

    const page = usePage('vv');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const list = document.getElementById('value-viewer-list')!;

    // function createFileElement(file: VaultDataFile): HTMLElement {
    //     const downloadUrl = URL.createObjectURL(
    //         new Blob([file.fileData], { type: file.type }),
    //     );

    //     const suffix = document.createElement('a');
    //     suffix.setAttribute('href', downloadUrl);
    //     suffix.setAttribute('download', file.name);
    //     suffix.innerHTML = UploadIcon;

    //     const card = renderFileCard({
    //         name: file.name,
    //         size: file.fileData.byteLength,
    //         onClick() {
    //             console.log('CLICK!');
    //             preview.showPreview(card, file);
    //         },
    //         suffix,
    //     });
    //     return card;
    // }

    return {
        onDecryptSuccess() {
            page.enterDown();
        },
        addFile(file: FileData, index: number) {
            const el = renderDownloadFileCard(file, () =>
                preview.showPreview(el, file),
            );
            el.setAttribute(
                'style',
                `animation-delay: ${500 + index * 100}ms;`,
            );
            list.appendChild(el);
        },
    };
}
