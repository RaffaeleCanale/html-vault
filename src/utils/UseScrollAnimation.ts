export function useScrollAnimation(
    element: HTMLElement,
    callbacks: { onShow: VoidFunction; onHide: VoidFunction },
): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callbacks.onShow();
            } else {
                callbacks.onHide();
            }
        });
    });

    observer.observe(element);
}
