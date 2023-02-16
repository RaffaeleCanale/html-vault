export type TemplateName = 'html-single' | 'html-split' | 'bash-single';

export async function fetchTemplate(template: TemplateName): Promise<string> {
    const response = await fetch(`/template-${template}`);

    if (!response.ok) {
        throw new Error('Failed to fetch template');
    }

    return response.text();
}
