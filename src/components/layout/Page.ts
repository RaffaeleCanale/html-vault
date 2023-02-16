export type PageId = 'vf';

export function usePage(id: PageId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pageEl = document.getElementById(id)!;
    const initialClasses = pageEl.className;

    return {
        enterDown() {
            pageEl.className = `${initialClasses} --enter-down`;
        },
        enterUp() {
            pageEl.className = `${initialClasses} --enter-up`;
        },
        exitDown() {
            pageEl.className = `${initialClasses} --exit-down`;
        },
        exitUp() {
            pageEl.className = `${initialClasses} --exit-up`;
        },
        remove() {
            pageEl.remove();
        },
    };
}
