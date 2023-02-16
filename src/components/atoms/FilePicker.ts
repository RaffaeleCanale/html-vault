export type FilePickerId = 'file-picker';

export function useFilePicker(id: FilePickerId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pickerContainer = document.getElementById(id)!;
    const input = document.getElementById(`${id}-input`) as HTMLInputElement;

    pickerContainer.addEventListener('click', (event) => {
        if (event.target === input) {
            return;
        }
        event.preventDefault();
        input.click();
    });

    return {
        onChange(callback: (files: FileList) => void) {
            input.addEventListener('change', (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                    callback(files);
                }
            });
        },

        getFiles(): File[] {
            if (!input.files) {
                return [];
            }
            return [...input.files];
        },

        setFiles(files: FileList) {
            input.files = files;
        },
    };
}
