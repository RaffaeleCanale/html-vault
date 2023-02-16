import type { TemplateName } from '../../../domains/template/TemplateManager';

export type TemplateCardId = TemplateName;

export function useTemplateCard(id: TemplateCardId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const card = document.getElementById(id)!;

    return {
        id,

        setActive(active: boolean) {
            if (active) {
                card.classList.add('--active');
            } else {
                card.classList.remove('--active');
            }
        },

        onClick(callback: (event: MouseEvent) => void) {
            card.addEventListener('click', callback);
        },
    };
}
