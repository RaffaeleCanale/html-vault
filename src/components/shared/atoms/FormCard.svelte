<form class="form-card" onsubmit="return false">
    <slot />
</form>

<style>
    .form-card {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        max-width: 30rem;
        gap: 1rem;
        color: var(--card-paragraph);
        padding: 2rem;
        background-color: var(--card-background);
    }

    .form-card :global(h1) {
        color: var(--card-headline);
        margin: 0 0 2rem 0;
        padding: 0;
    }
</style>
