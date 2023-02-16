export type ErrorHintId = 'error';

export function useErrorHint(id: ErrorHintId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const errorEl = document.getElementById(id)!;

    return {
        show(): void {
            errorEl.removeAttribute('hidden');
        },
        hide(): void {
            errorEl.setAttribute('hidden', 'true');
        },
    };
}
