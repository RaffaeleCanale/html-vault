import type { EncryptPipeline } from '../../domains/pipelines/EncryptPipeline';
import { HtmlSingleEncrypt } from '../../domains/pipelines/HtmlSinglePipeline';
import { HtmlSplitEncrypt } from '../../domains/pipelines/HtmlSplitPipeline';
import type { TemplateName } from '../../domains/template/TemplateManager';
import { useFilesSlide } from './slides/FilesSlide';
import { usePasswordFormSlide } from './slides/PasswordFormSlide';
import { useTemplatePickerSlide } from './slides/TemplatePickerSlide';

function getEncryptPipeline(templateName: TemplateName): EncryptPipeline {
    switch (templateName) {
        case 'html-single':
            return HtmlSingleEncrypt;
        case 'html-split':
            return HtmlSplitEncrypt;
        default:
            throw new Error('Not supported');
    }
}

function useEditorPage() {
    const files = useFilesSlide();
    const template = useTemplatePickerSlide();
    const passwordForm = usePasswordFormSlide();

    HtmlSingleEncrypt.prefetch();
    HtmlSplitEncrypt.prefetch();

    passwordForm.onSubmit(async (password) => {
        const pipeline = getEncryptPipeline(template.getSelectedTemplate());
        const result = await pipeline.encrypt(files.getFiles(), password);

        passwordForm.setResultFiles(result);
    });
}

useEditorPage();
