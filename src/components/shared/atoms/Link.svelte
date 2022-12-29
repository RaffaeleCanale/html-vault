<script lang="ts">
    export let href: string;
    export let download: string | undefined = undefined;
</script>

<a {href} {download}><slot /></a>

<style>
    a {
        text-decoration: none;
        color: var(--link);
        font-weight: bold;
    }

    a:hover {
        color: var(--heading);
    }
</style>
