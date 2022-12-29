<script lang="ts">
    import FilesList from './files-list/FilesSection.svelte';
    import PasswordForm from './password/PasswordForm.svelte';
    import { useFilesList } from './UseFilesList';

    const { addFiles, removeFile, files, encrypt, downloadUrl } =
        useFilesList();
</script>

<div class="editor">
    <FilesList files={$files} {removeFile} {addFiles} />
    <PasswordForm {encrypt} {downloadUrl} />
</div>

<style>
    .editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
        margin-top: 3rem;
    }
</style>
