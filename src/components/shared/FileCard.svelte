<script lang="ts">
    import { formatBytes } from '../../utils/FileUtils';

    export let name: string;
    export let size: number;
    export let clickableDetails: boolean = false;
</script>

<div class="file-card">
    <div class="file-card__details" class:--clickable={clickableDetails}>
        <h3>{name}</h3>
        <span>{formatBytes(size)}</span>
    </div>

    {#if $$slots.suffix}
        <div class="file-card__suffix --clickable">
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
        /* align-items: center; */
        background-color: var(--card-background);
        /* padding: 1rem; */
        /* gap: 1rem; */
        /* align-items: stretch; */
    }

    .file-card__details {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.2rem;
        color: var(--card-paragraph);
        padding: 1rem;
    }

    .--clickable {
        cursor: pointer;
    }

    .--clickable:hover {
        background-color: var(--paragraph);
    }

    .file-card__suffix {
        padding: 1rem;
    }
</style>
