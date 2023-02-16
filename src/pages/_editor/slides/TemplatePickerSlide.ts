import { useAnimatedLabel } from '../../../components/atoms/AnimatedLabel';
import { TemplateName } from '../../../domains/template/TemplateManager';
import { useTemplateCard } from '../components/TemplateCard';

export function useTemplatePickerSlide() {
    useAnimatedLabel('choose-template');

    const templates: TemplateName[] = [
        'html-single',
        'html-split',
        'bash-single',
    ];
    const cards = templates.map(useTemplateCard);

    let selectedTemplate: TemplateName = 'html-single';
    function selectTemplate(template: TemplateName) {
        selectedTemplate = template;

        cards.forEach((card) => {
            card.setActive(card.id === template);
        });
    }

    cards.forEach((card) => {
        card.onClick(() => selectTemplate(card.id));
    });
    selectTemplate(selectedTemplate);

    return {
        getSelectedTemplate(): TemplateName {
            return selectedTemplate;
        },
    };
}
