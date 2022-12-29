<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let type: 'submit' | 'button' = 'button';
    export let id: string | undefined = undefined;
    const dispatch = createEventDispatcher();

    function onClick(event: MouseEvent) {
        dispatch('click', event);
    }
</script>

<button {id} {type} on:click={onClick}><slot /></button>

<style>
    button {
        font-size: 1.2rem;
        color: var(--headline);
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        background-color: var(--link);
        transition: filter 200ms ease-out;
    }

    button:hover {
        filter: brightness(110%);
    }

    button:active {
        filter: brightness(80%);
    }
</style>
