<script lang="ts">
    import type { FileWrapper } from '../UseFilesList';
    import DragAndDropContainer from './DragAndDropContainer.svelte';
    import FilesList from './FilesList.svelte';

    export let files: FileWrapper[];
    export let removeFile: (file: FileWrapper) => void;
    export let addFiles: (files: FileList) => void;
</script>

<div class="files-section">
    <h1>Files</h1>
    <DragAndDropContainer {addFiles}>
        <FilesList {files} {removeFile} />
    </DragAndDropContainer>
</div>

<style>
    h1 {
        color: var(--headline);
        margin: 0;
    }
    .files-section {
        padding: 1rem;
    }
</style>
