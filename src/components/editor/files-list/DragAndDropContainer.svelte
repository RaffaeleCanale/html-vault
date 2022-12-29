<script lang="ts">
    import DragAndDropPicker from '../../shared/molecules/DragAndDropPicker.svelte';

    export let addFiles: (files: FileList) => void;

    let isDragging = false;

    function onDrop(event: DragEvent): void {
        event.preventDefault();

        if (event.dataTransfer?.files) {
            addFiles(event.dataTransfer.files);
        }
        isDragging = false;
    }

    function onDragOver(event: DragEvent): void {
        event.preventDefault();
        isDragging = !!event.dataTransfer?.files;
    }

    function onDragLeave(): void {
        isDragging = false;
    }

    function onChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            addFiles(target.files);
        }
    }

    let input: HTMLInputElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="drag-and-drop-container"
    on:drop={onDrop}
    on:dragover={onDragOver}
    on:dragleave={onDragLeave}
>
    <DragAndDropPicker on:change={onChange} {isDragging} />

    <div class="drag-and-drop-container__list">
        <slot />
    </div>
</div>

<style>
    .drag-and-drop-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        width: 100%;
        border: dashed 5px var(--card-background);
        border-radius: 1rem;
    }

    .drag-and-drop-container__list {
        padding: 0.5rem;
    }
</style>
