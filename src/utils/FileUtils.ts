export function readFile(file: File): Promise<ArrayBuffer>;
export function readFile(file: File, encoding: 'utf-8'): Promise<string>;
export function readFile(
    file: File,
    encoding?: string,
): Promise<ArrayBuffer | string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            resolve(event.target!.result!);
        };
        reader.onerror = (event) => {
            reject(event);
        };
        if (encoding) {
            reader.readAsText(file, encoding);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
}

export interface UploadedFile {
    name: string;
    type: string;
    data: Promise<ArrayBuffer>;
}

export interface FileData {
    name: string;
    type: string;
    data: ArrayBuffer;
}

export function awaitFiles(files: UploadedFile[]): Promise<FileData[]> {
    return Promise.all(
        files.map(async (file) => ({
            name: file.name,
            type: file.type,
            data: await file.data,
        })),
    );
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        sizes.length - 1,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]!}`;
}

export function randomId(): string {
    return Math.random().toString(36).substring(2, 9);
}
