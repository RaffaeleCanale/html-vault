<script lang="ts">
    export let id: string | undefined = undefined;
    export let hidden: boolean = false;
</script>

<div {id} {hidden} class="error-hint"><slot /></div>

<style>
    .error-hint {
        color: var(--error);
        font-weight: bold;
        align-self: flex-start;
        opacity: 0;
        animation: popIn 300ms ease-out;
        animation-fill-mode: forwards;
    }

    @keyframes popIn {
        0% {
            scale: 0.6;
            opacity: 0;
        }
        60% {
            opacity: 1;
        }
        80% {
            scale: 1.05;
        }
        100% {
            scale: 1;
            opacity: 1;
        }
    }
</style>
