<script lang="ts">
    export let input: HTMLInputElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="file-picker" on:click>
    <input bind:this={input} type="file" multiple hidden on:change />
    <slot />
</div>

<style>
    .file-picker {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
</style>
