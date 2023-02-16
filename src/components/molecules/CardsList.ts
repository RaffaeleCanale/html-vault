import type { FilePickerId } from '../atoms/FilePicker';

export type CardsListId = `${FilePickerId}-list` | 'encrypted-vault-list';

export function useCardsList(id: CardsListId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = document.getElementById(id)!;
    return {
        addCard(card: HTMLElement) {
            container.appendChild(card);
        },

        setCards(cards: HTMLElement[]) {
            container.innerHTML = '';
            cards.forEach((card) => {
                container.appendChild(card);
            });
        },

        removeCard(card: HTMLElement) {
            card.classList.add('--disappear');
            setTimeout(() => {
                container.removeChild(card);
            }, 300);
        },
    };
}
