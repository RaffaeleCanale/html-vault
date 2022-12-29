<script lang="ts">
    import FilesSection from './files-list/FilesSection.svelte';
    import PasswordForm from './password/PasswordForm.svelte';
    import { useFilesList } from './UseFilesList';

    const { addFiles, removeFile, files, encrypt, downloadUrl } =
        useFilesList();
</script>

<div class="editor">
    <FilesSection files={$files} {removeFile} {addFiles} />
    <PasswordForm {encrypt} {downloadUrl} />
</div>

<style>
    .editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .editor > :global(*) {
        max-width: 30rem;
    }
    .editor > :global(:first-child) {
        max-width: 60rem;
        min-width: min(100%, 30rem);
    }
</style>
