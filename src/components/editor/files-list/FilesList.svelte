<script lang="ts">
    import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';
    import { crossfade } from 'svelte/transition';
    import FileCard from '../../shared/FileCard.svelte';
    import DeleteIcon from '../../shared/icons/DeleteIcon.svelte';
    import IconWithSpinner from '../../shared/molecules/IconWithSpinner.svelte';
    import type { FileWrapper } from '../UseFilesList';

    export let files: FileWrapper[];
    export let removeFile: (file: FileWrapper) => void;
    export let id: string | undefined = undefined;

    const [send, receive] = crossfade({
        fallback(node) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 300,
                easing: quintOut,
                css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
            };
        },
    });
</script>

<div {id} class="files-list">
    {#each files as file (file.id)}
        <div
            in:receive={{ key: file.id }}
            out:send={{ key: file.id }}
            animate:flip={{ duration: 200 }}
        >
            <FileCard name={file.name} size={file.size}>
                <IconWithSpinner
                    slot="suffix"
                    showSpinner={file.state === 'loading'}
                    on:click={() => removeFile(file)}
                >
                    <DeleteIcon />
                </IconWithSpinner>
            </FileCard>
        </div>
    {/each}
</div>

<style>
    .files-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
    }
</style>
