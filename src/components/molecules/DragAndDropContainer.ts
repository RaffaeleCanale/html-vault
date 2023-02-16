import { FilePickerId, useFilePicker } from '../atoms/FilePicker';

export function useDragAndDropContainer(filePickerId: FilePickerId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.getElementById(`${filePickerId}-container`)!;
    const picker = useFilePicker(filePickerId);

    container.addEventListener('dragover', (event) => {
        event.preventDefault();

        if (event.dataTransfer?.files) {
            container.classList.add('--dragging');
        }
    });

    container.addEventListener('dragleave', () => {
        container.classList.remove('--dragging');
    });

    return {
        onChange(callback: (files: FileList) => void) {
            picker.onChange(callback);
            container.addEventListener('drop', (event) => {
                event.preventDefault();
                container.classList.remove('--dragging');

                if (event.dataTransfer?.files) {
                    callback(event.dataTransfer.files);
                }
                // isDragging = false;
            });
        },
    };
}
