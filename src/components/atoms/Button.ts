// import CogWheelSpinner from './CogWheelSpinner.svg';

export type ButtonId = 'submit';

export function useButton(id: ButtonId) {
    const buttonEl = document.getElementById(id) as HTMLButtonElement;

    return {
        onClick(callback: VoidFunction): void {
            buttonEl.addEventListener('click', callback);
        },
    };
}

export function useLoadingButton(id: ButtonId) {
    const buttonEl = document.getElementById(id) as HTMLButtonElement;

    buttonEl.children.item(0)?.setAttribute('hidden', 'true');

    return {
        setLoading(loading: boolean): void {
            if (loading) {
                buttonEl.children.item(0)?.removeAttribute('hidden');
                buttonEl.children.item(1)?.setAttribute('hidden', 'true');
            } else {
                buttonEl.children.item(0)?.setAttribute('hidden', 'true');
                buttonEl.children.item(1)?.removeAttribute('hidden');
            }

            // if (loading) {
            //     parent.innerHTML = '';
            //     parent
            //         .appendChild(document.createElement('div'))
            //         .classList.add('loading-spinner');
            // }
        },

        onClick(callback: () => void): void {
            buttonEl.addEventListener('click', callback);
        },
    };
}
