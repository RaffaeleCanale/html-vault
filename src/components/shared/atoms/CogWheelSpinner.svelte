<script lang="ts">
    export let id: string | undefined = undefined;
</script>

<div {id} class="spinner">
    <div>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
    </div>
</div>

<style is:global>
    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(22.5deg);
        }
        100% {
            transform: rotate(45deg);
        }
    }
    .spinner > div {
        animation: spinner 0.15s infinite linear;
        width: inherit;
        height: inherit;
    }
    .spinner > div div {
        position: absolute;
        width: 14%;
        height: 100%;
        background: var(--link);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .spinner > div div:nth-child(1) {
        width: 78%;
        height: 78%;
        border-radius: 50%;
    }
    .spinner > div div:nth-child(6) {
        width: 26%;
        height: 26%;
        background: var(--card-background);
        border-radius: 50%;
    }
    .spinner > div div:nth-child(3) {
        transform: translate(-50%, -50%) rotate(45deg);
    }
    .spinner > div div:nth-child(4) {
        transform: translate(-50%, -50%) rotate(90deg);
    }
    .spinner > div div:nth-child(5) {
        transform: translate(-50%, -50%) rotate(135deg);
    }
    .spinner {
        position: relative;
        transform: translateZ(0) scale(1);
        backface-visibility: hidden;
        transform-origin: 0 0;
        height: 50px;
        width: 50px;
    }
    .spinner div {
        box-sizing: content-box;
    }
</style>
