import type { FileData } from '../../../utils/FileUtils';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function useFilePreviewDialog() {
    const dialog = document.getElementById('file-preview-dialog')!;
    const titleEl = document.getElementById('fp-title')!;
    const previewEl = document.getElementById('file-preview')!;
    const downloadEl = document.getElementById(
        'fp-download',
    ) as HTMLAnchorElement;

    downloadEl.onclick = (e) => e.stopPropagation();

    dialog.addEventListener('click', () => {
        // filePreviewPageEl.setAttribute('style', 'display: none;');
        dialog.classList.add('shrink');
        setTimeout(() => {
            dialog.classList.remove('shrink');
            dialog.removeAttribute('style');
        }, 300);
    });

    return {
        showPreview(fileEl: HTMLElement, file: FileData) {
            // page.classList.remove('test');

            const rect = fileEl.getBoundingClientRect();

            console.log('fileEl', fileEl);
            console.log('rect', rect);
            const styles = [
                'display: flex',
                `left: ${rect.left}px`,
                `top: ${rect.top}px`,
                `width: ${rect.width}px`,
                `height: ${rect.height}px`,
            ].join(';');
            dialog.setAttribute('style', styles);

            previewEl.innerHTML = '';
            previewEl.appendChild(render(file, titleEl, downloadEl));
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

function render(
    file: FileData,
    titleEl: HTMLElement,
    downloadEl: HTMLAnchorElement,
): HTMLElement {
    const blob = new Blob([file.data], { type: file.type });
    const downloadUrl = URL.createObjectURL(blob);

    titleEl.innerText = file.name;

    downloadEl.download = file.name;
    downloadEl.href = downloadUrl;

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.setAttribute('src', downloadUrl);
        return img;
    }

    switch (file.type) {
        case 'text/plain':
            const div = document.createElement('div');
            div.innerText = new TextDecoder().decode(file.data as ArrayBuffer);
            div.classList.add('--text');
            return div;
        case 'application/pdf':
            // <embed src="file_name.pdf" width="800px" height="2100px" />

            const embed = document.createElement('embed');
            embed.setAttribute('src', downloadUrl);
            embed.setAttribute('width', '100%');
            embed.setAttribute('height', '100%');
            return embed;
        default: {
            const div = document.createElement('div');
            div.classList.add('__no-preview');
            div.innerText = 'No preview available';
            return div;
        }
    }
}
