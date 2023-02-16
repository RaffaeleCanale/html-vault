export type PasswordFieldId = 'password' | 'password-confirmation';
export type Variant = 'regular' | 'error';

export function usePasswordField(id: PasswordFieldId) {
    const passwordEl = document.getElementById(id) as HTMLInputElement;

    return {
        setVariant(variant: Variant): void {
            passwordEl.classList.remove('regular', 'error');
            passwordEl.classList.add(variant);
        },

        getValue(): string {
            return passwordEl.value;
        },
    };
}
