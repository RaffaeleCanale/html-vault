<script lang="ts">
    export let id: string | undefined = undefined;
    export let placeholder: string | undefined = undefined;
    export let value: string | undefined = undefined;
    export let variant: 'regular' | 'error' = 'regular';
</script>

<input
    bind:value
    type="password"
    class:error={variant === 'error'}
    {placeholder}
    {id}
/>

<style>
    .error {
        border: 5px solid var(--error);
        animation: blink 300ms;
        animation-iteration-count: 3;
        outline: 3px solid transparent;
    }

    input {
        border: 5px transparent solid;
        font-size: 2rem;
        text-align: center;
        background-color: var(--background);
        transition: outline 200ms ease-out;
        transition: border 200ms ease-out;
    }

    input:focus {
        outline: 3px solid var(--link);
    }

    input::placeholder {
        font-size: 1.4rem;
    }

    @keyframes blink {
        50% {
            outline-color: var(--error);
        }
    }
</style>
