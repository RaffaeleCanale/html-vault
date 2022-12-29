<script lang="ts">
    import FilePicker from '../atoms/FilePicker.svelte';
    import Link from '../atoms/Link.svelte';
    import UploadIcon from '../icons/UploadIcon.svelte';

    export let isDragging: boolean;
    let input: HTMLInputElement;

    function onClick(event: MouseEvent): void {
        if (event.target === input) {
            return;
        }
        event.preventDefault();
        input.click();
    }
</script>

<FilePicker on:change on:click={onClick} bind:input>
    <div class:is-dragging={isDragging} class="drag-and-drop-picker">
        <UploadIcon />
        <span>
            <Link href="#">Choose a file</Link> or drag it here.
        </span>
    </div>
</FilePicker>

<style>
    .drag-and-drop-picker {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 1rem;

        width: 100%;
        height: 100%;
    }

    span {
        transition: opacity 200ms;
    }

    .is-dragging span {
        opacity: 0;
    }

    :global(svg) {
        transition: transform 300ms;
    }

    .is-dragging :global(svg) {
        transform: translateY(50%);
    }
</style>
