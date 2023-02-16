import { useAnimatedLabel } from '../../../components/atoms/AnimatedLabel';
import { useLoadingButton } from '../../../components/atoms/Button';
import { useErrorHint } from '../../../components/atoms/ErrorHint';
import { usePasswordField } from '../../../components/atoms/PasswordField';
import { useCardsList } from '../../../components/molecules/CardsList';
import { renderDownloadFileCard } from '../../../components/molecules/FileCard';
import type { FileData } from '../../../utils/FileUtils';

export function usePasswordFormSlide() {
    useAnimatedLabel('choose-password');

    const password = usePasswordField('password');
    const passwordConfirmation = usePasswordField('password-confirmation');
    const errorHint = useErrorHint('error');
    const submitButton = useLoadingButton('submit');

    const cardsList = useCardsList('encrypted-vault-list');

    // let password = '';
    // let passwordConfirmation = '';
    // let showErrorHint = false;

    // let isProcessing = false;

    async function onSubmit(callback: (password: string) => Promise<void>) {
        errorHint.hide();
        passwordConfirmation.setVariant('regular');

        errorHint.hide();
        submitButton.setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));
        if (password.getValue() !== passwordConfirmation.getValue()) {
            errorHint.show();
            passwordConfirmation.setVariant('error');
            return;
        }

        try {
            await callback(password.getValue());
        } finally {
            submitButton.setLoading(false);
        }
    }

    return {
        onSubmit(callback: (password: string) => Promise<void>): void {
            submitButton.onClick(() => void onSubmit(callback));
        },

        setResultFiles(files: FileData[]): void {
            cardsList.setCards(
                files.map((file) => renderDownloadFileCard(file)),
            );
        },
    };
}
