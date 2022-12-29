export function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target?.result as ArrayBuffer);
        };
        reader.onerror = (event) => {
            reject(event);
        };
        reader.readAsArrayBuffer(file);
    });
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
