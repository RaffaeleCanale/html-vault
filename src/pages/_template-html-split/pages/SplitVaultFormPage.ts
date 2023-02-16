import { useButton } from '../../../components/atoms/Button';
import { useErrorHint } from '../../../components/atoms/ErrorHint';
import { usePasswordField } from '../../../components/atoms/PasswordField';
import { usePage } from '../../../components/layout/Page';
import { useFilesPicker } from '../../../components/organisms/FilesPicker';
import { UploadedFile } from '../../../utils/FileUtils';

export function useSplitVaultFormPage() {
    const page = usePage('vf');

    const error = useErrorHint('error');
    const password = usePasswordField('password');
    const submit = useButton('submit');

    const files = useFilesPicker('file-picker');

    return {
        onDecryptStart() {
            page.exitUp();
            error.hide();
            password.setVariant('regular');
        },
        onDecryptError() {
            error.show();
            password.setVariant('error');

            page.enterUp();
        },
        onDecryptSuccess() {
            page.remove();
        },
        getPassword() {
            return password.getValue();
        },
        onSubmit(callback: VoidFunction) {
            submit.onClick(callback);
        },
        getFiles(): UploadedFile[] {
            return files.getFiles();
        },
    };
}
