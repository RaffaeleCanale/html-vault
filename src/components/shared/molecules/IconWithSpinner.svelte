<script lang="ts">
    import LoadingSpinner from '../atoms/LoadingSpinner.svelte';

    export let showSpinner = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icon-with-spinner" on:click>
    {#if showSpinner}
        <LoadingSpinner />
    {/if}
    <slot />
</div>

<style>
    .icon-with-spinner {
        position: relative;
        cursor: pointer;
        height: 3rem;
        width: 3rem;
    }

    div.icon-with-spinner :global(div.spinner-container) {
        position: absolute;
        height: 3rem;
        width: 3rem;
    }

    .icon-with-spinner :global(svg) {
        position: absolute;
        left: 0.5rem;
        top: 0.5rem;
        height: 2rem;
        width: 2rem;
    }
</style>
