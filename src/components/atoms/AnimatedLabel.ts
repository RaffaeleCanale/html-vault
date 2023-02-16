import { useScrollAnimation } from '../../utils/UseScrollAnimation';

export type AnimatedLabelId =
    | 'choose-files'
    | 'choose-template'
    | 'choose-password';

export function useAnimatedLabel(id: AnimatedLabelId) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const label = document.getElementById(id)!;

    useScrollAnimation(label, {
        onShow() {
            label.classList.add('--animate');
        },
        onHide() {
            label.classList.remove('--animate');
        },
    });
}
