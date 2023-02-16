import { usePage } from '../../../components/layout/Page';

export function useLoadingPage() {
    const page = usePage('lp');
    // const loadingPageEl = document.getElementById('lp')!;

    return {
        onDecryptStart() {
            page.enterDown();
        },
        onDecryptSuccess() {
            page.exitUp();
            setTimeout(() => {
                page.remove();
            }, 600);
        },
        onDecryptError() {
            page.exitDown();
            setTimeout(() => {
                // loadingPageEl.classList.remove('--exit-down');
            }, 600);
        },
    };
}
