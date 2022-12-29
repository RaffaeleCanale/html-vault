import { onMount } from 'svelte';
import { get, writable } from 'svelte/store';
import { encryptVault } from '../../converters/VaultEncrypter';
import type { Vault } from '../../model/Vault';
import { fetchTemplate } from '../../resources/VaultTemplate';
import { readFile } from '../../utils/FileUtils';
import { serializeToJs } from '../../utils/Serializer';

export type FilesList = ReturnType<typeof useFilesList>;

export interface FileWrapper {
    id: string;
    name: string;
    type: string;
    size: number;
    data: Promise<ArrayBuffer>;
    state: 'ready' | 'loading' | 'error';
}

async function fromFiles(files: FileWrapper[]): Promise<Vault> {
    const data: Vault = {
        files: [],
    };

    for (const file of files) {
        data.files.push({
            name: file.name,
            type: file.type,
            fileData: await file.data,
        });
    }

    return data;
}

export function useFilesList() {
    let templatePromise: Promise<string>;
    const files = writable<FileWrapper[]>([]);

    const downloadUrl = writable<string | null>(null);

    onMount(() => {
        templatePromise = fetchTemplate();
    });

    function processFile(file: File): FileWrapper {
        function updateState(state: FileWrapper['state']) {
            files.update((files) => {
                const index = files.findIndex((f) => f.id === wrapper.id);
                if (index < 0) {
                    return files;
                }

                const newFiles = [...files];
                newFiles[index] = {
                    ...newFiles[index]!,
                    state,
                };

                return newFiles;
            });
        }

        const wrapper: FileWrapper = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            state: 'loading',
            data: readFile(file)
                .then((data) => {
                    updateState('ready');
                    return data;
                })
                .catch((error) => {
                    console.error('Error while reading file', error);
                    updateState('error');
                    throw error;
                }),
        };

        return wrapper;
    }

    return {
        downloadUrl,
        files,

        addFiles(newFiles: FileList): void {
            files.update((files) => {
                return [...files, ...Array.from(newFiles).map(processFile)];
            });
        },

        removeFile(file: FileWrapper): void {
            files.update((files) => files.filter((f) => f !== file));
        },

        async encrypt(password: string): Promise<void> {
            const data = await fromFiles(get(files));
            const vault = await encryptVault(data, password);

            const serializedVault = serializeToJs(vault);

            const template = await templatePromise;

            const result = template.replace(
                '__VAULT_PLACEHOLDER__',
                serializedVault,
            );

            downloadUrl.set(
                `data:application/octet-stream;base64,${btoa(result)}`,
            );
        },
    };
}
