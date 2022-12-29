<script lang="ts">
    import { tick } from 'svelte';
    import type { Writable } from 'svelte/store';
    import Button from '../../shared/atoms/Button.svelte';
    import CogWheelSpinner from '../../shared/atoms/CogWheelSpinner.svelte';
    import ErrorHint from '../../shared/atoms/ErrorHint.svelte';
    import FormCard from '../../shared/atoms/FormCard.svelte';
    import Link from '../../shared/atoms/Link.svelte';
    import PasswordField from '../../shared/atoms/PasswordField.svelte';

    export let encrypt: (password: string) => Promise<void>;
    export let downloadUrl: Writable<string | null>;

    let password = '';
    let passwordConfirmation = '';
    let showErrorHint = false;

    let isProcessing = false;

    async function onSubmit() {
        showErrorHint = false;
        await tick();
        if (password !== passwordConfirmation) {
            showErrorHint = true;
            return;
        }

        showErrorHint = false;
        isProcessing = true;

        try {
            await encrypt(password);
        } finally {
            isProcessing = false;
        }
    }
</script>

<FormCard>
    <PasswordField placeholder="Enter a password" bind:value={password} />
    <PasswordField
        placeholder="Repeat the password"
        bind:value={passwordConfirmation}
        variant={showErrorHint ? 'error' : 'regular'}
    />
    {#if showErrorHint}
        <ErrorHint>Passwords do not match</ErrorHint>
    {/if}

    <div class="submit-row">
        {#if $downloadUrl !== null}
            <Link download="vault.html" href={$downloadUrl}>Download</Link>
        {/if}
        {#if isProcessing}
            <CogWheelSpinner />
        {:else}
            <Button type="submit" on:click={onSubmit}>Encrypt</Button>
        {/if}
    </div>
</FormCard>

<style>
    .submit-row {
        display: flex;
        align-self: flex-end;
        align-items: center;
        gap: 1rem;
    }

    .submit-row :global(.spinner) {
        height: 2rem;
        width: 2rem;
        margin-right: 1rem;
    }
</style>
