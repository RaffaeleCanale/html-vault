<div class="spinner-container">
    <div class="spinner">
        <div />
    </div>
</div>

<style type="text/css">
    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .spinner div {
        position: absolute;
        animation: spinner 1s linear infinite;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        top: 4px;
        left: 4px;
        border-radius: 50%;
        box-shadow: 0 4px 0 0 var(--link);
        transform-origin: 50% 50%;
    }
    .spinner-container {
        width: 100px;
        height: 100px;
        display: inline-block;
        overflow: hidden;
    }
    .spinner {
        width: 100%;
        height: 100%;
        position: relative;
        transform: translateZ(0) scale(1);
        backface-visibility: hidden;
        transform-origin: 0 0;
    }
    .spinner div {
        box-sizing: content-box;
    }
</style>
