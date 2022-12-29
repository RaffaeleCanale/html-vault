<script lang="ts">
    import { formatBytes } from '../../utils/FileUtils';

    export let name: string;
    export let size: number;
</script>

<div class="file-card">
    <div class="file-card__details">
        <h3>{name}</h3>
        <span>{formatBytes(size)}</span>
    </div>

    {#if $$slots.suffix}
        <div>
            <slot name="suffix" />
        </div>
    {/if}
</div>

<style>
    h3 {
        margin: 0;
    }

    .file-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: var(--card-background);
        padding: 1rem;
        gap: 1rem;
    }

    .file-card__details {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.2rem;
        color: var(--card-paragraph);
    }
</style>
